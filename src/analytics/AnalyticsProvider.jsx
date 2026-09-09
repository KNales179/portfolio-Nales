import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { track, flush, startTracker } from "./tracker.js";
import { trackInteraction } from "./track.js";


// ============================================================
// ANALYTICS PROVIDER
// ============================================================
//
// Mounted once, inside the router. Turns route changes into
// anonymous PAGE_VIEW / PAGE_EXIT events.
//
// - Only public portfolio routes are tracked. Anything under
//   /admin (and /login) is ignored entirely.
// - PAGE_EXIT carries time-on-page for the route being left.
// - A short guard neutralizes React StrictMode's double effect
//   invocation in development.
// ============================================================

const MIN_TRACKABLE_DURATION_MS = 250;
const VIEW_DEDUPE_WINDOW_MS = 1000;
const SCROLL_DEPTH_BUCKETS = [25, 50, 75, 100];


const isPublicPath = (path) => {
    if (typeof path !== "string" || !path.startsWith("/")) {
        return false;
    }

    const lower = path.toLowerCase();

    return (
        lower !== "/login" &&
        lower !== "/admin" &&
        !lower.startsWith("/admin/")
    );
};


function AnalyticsProvider() {
    const location = useLocation();

    // { path, enteredAt } for the route currently being viewed,
    // or null when the visitor is on a non-tracked route.
    const currentPage = useRef(null);

    // Guards StrictMode / rapid re-renders from double-counting.
    const lastView = useRef({ path: null, at: 0 });


    // --------------------------------------------------------
    // START THE BATCHING TRACKER ONCE
    // --------------------------------------------------------

    useEffect(() => {
        startTracker();
    }, []);


    // --------------------------------------------------------
    // ROUTE CHANGES
    // --------------------------------------------------------

    useEffect(() => {
        const path = location.pathname;
        const now = Date.now();

        const leaving = currentPage.current;

        // Close out the previous page.
        if (leaving && leaving.path !== path) {
            const durationMs = now - leaving.enteredAt;

            if (durationMs >= MIN_TRACKABLE_DURATION_MS) {
                track("PAGE_EXIT", {
                    path: leaving.path,
                    durationMs,
                });
            }

            currentPage.current = null;
        }

        // Non-tracked route (admin area, login) — stop here.
        if (!isPublicPath(path)) {
            currentPage.current = null;
            return;
        }

        // Already on this path (StrictMode remount, replace nav).
        if (
            currentPage.current &&
            currentPage.current.path === path
        ) {
            return;
        }

        const isDuplicate =
            lastView.current.path === path &&
            now - lastView.current.at < VIEW_DEDUPE_WINDOW_MS;

        const isFirstView = lastView.current.path === null;

        if (!isDuplicate) {
            track("PAGE_VIEW", {
                path,
                referrer:
                    isFirstView && typeof document !== "undefined"
                        ? document.referrer || null
                        : null,
            });

            lastView.current = { path, at: now };
        }

        currentPage.current = {
            path,
            enteredAt: now,
        };
    }, [location.pathname]);


    // --------------------------------------------------------
    // SCROLL DEPTH — 25 / 50 / 75 / 100, once each per page
    // --------------------------------------------------------

    useEffect(() => {
        const path = location.pathname;

        if (!isPublicPath(path)) {
            return undefined;
        }

        const fired = new Set();
        let frame = 0;

        const measure = () => {
            frame = 0;

            const doc = document.documentElement;
            const scrollable =
                doc.scrollHeight - window.innerHeight;

            if (scrollable <= 0) {
                // Page fits the viewport — count it as fully seen.
                for (const bucket of SCROLL_DEPTH_BUCKETS) {
                    if (!fired.has(bucket)) {
                        fired.add(bucket);
                        trackInteraction(
                            "SCROLL_DEPTH",
                            String(bucket)
                        );
                    }
                }
                return;
            }

            const percent =
                (window.scrollY / scrollable) * 100;

            for (const bucket of SCROLL_DEPTH_BUCKETS) {
                if (
                    percent >= bucket &&
                    !fired.has(bucket)
                ) {
                    fired.add(bucket);
                    trackInteraction(
                        "SCROLL_DEPTH",
                        String(bucket)
                    );
                }
            }
        };

        const onScroll = () => {
            if (frame) {
                return;
            }

            frame = window.requestAnimationFrame(measure);
        };

        window.addEventListener("scroll", onScroll, {
            passive: true,
        });

        // Give the new page a beat to lay out, then take a
        // first reading (covers short pages / restored scroll).
        const initialTimer = window.setTimeout(measure, 600);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.clearTimeout(initialTimer);

            if (frame) {
                window.cancelAnimationFrame(frame);
            }
        };
    }, [location.pathname]);


    // --------------------------------------------------------
    // TAB HIDDEN / CLOSED — CLOSE OUT THE OPEN PAGE
    // --------------------------------------------------------

    useEffect(() => {
        const closeOpenPage = () => {
            const open = currentPage.current;

            if (!open) {
                return;
            }

            const durationMs = Date.now() - open.enteredAt;

            if (durationMs >= MIN_TRACKABLE_DURATION_MS) {
                track("PAGE_EXIT", {
                    path: open.path,
                    durationMs,
                });
            }

            // Re-arm so a returning visitor's next visible
            // period is measured fresh.
            currentPage.current = {
                path: open.path,
                enteredAt: Date.now(),
            };

            flush(true);
        };

        const onVisibility = () => {
            if (document.visibilityState === "hidden") {
                closeOpenPage();
            }
        };

        window.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("pagehide", closeOpenPage);

        return () => {
            window.removeEventListener(
                "visibilitychange",
                onVisibility
            );
            window.removeEventListener(
                "pagehide",
                closeOpenPage
            );
        };
    }, []);


    return null;
}

export default AnalyticsProvider;
