// ============================================================
// ANALYTICS — CLIENT TRACKER
// ============================================================
//
// Collects small anonymous events and sends them to the backend
// in batches:
//
//   - flush on an interval
//   - flush when the queue reaches a threshold
//   - flush (via sendBeacon) when the tab is hidden or closed
//
// Nothing here identifies a visitor. See ids.js and the backend
// AnalyticsEvent model for the privacy model.
// ============================================================

import { getSessionId, touchSession } from "./ids.js";


// ============================================================
// CONFIG
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://portfolio-nales-backend.onrender.com";

const COLLECT_ENDPOINT = `${API_BASE_URL}/api/analytics/collect`;

const FLUSH_INTERVAL_MS = 10 * 1000;
const FLUSH_AT_QUEUE_SIZE = 10;
const MAX_BATCH = 50;


// ============================================================
// STATE
// ============================================================

let queue = [];
let intervalId = null;
let started = false;


// ============================================================
// SEND
// ============================================================

const sendBatch = (events, useBeacon) => {
    if (events.length === 0) {
        return;
    }

    const payload = JSON.stringify({ events });

    // Page is unloading — sendBeacon is the only reliable option.
    if (
        useBeacon &&
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function"
    ) {
        try {
            const blob = new Blob([payload], {
                type: "application/json",
            });

            navigator.sendBeacon(COLLECT_ENDPOINT, blob);
            return;
        } catch {
            // Fall through to fetch.
        }
    }

    try {
        fetch(COLLECT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: payload,
            keepalive: true,
            // Analytics must never block or surface errors in
            // the portfolio UI.
        }).catch(() => {});
    } catch {
        // Ignore — analytics is best-effort.
    }
};


// ============================================================
// FLUSH
// ============================================================

export const flush = (useBeacon = false) => {
    if (queue.length === 0) {
        return;
    }

    const batch = queue.slice(0, MAX_BATCH);
    queue = queue.slice(MAX_BATCH);

    sendBatch(batch, useBeacon);

    // If the queue still has items and we are not unloading,
    // let the interval pick them up on the next tick.
};


// ============================================================
// TRACK
// ============================================================

export const track = (type, data = {}) => {
    if (typeof window === "undefined") {
        return;
    }

    touchSession();

    queue.push({
        type,
        sessionId: getSessionId(),
        path: data.path,
        referrer: data.referrer ?? null,
        durationMs: data.durationMs ?? null,
        action: data.action ?? null,
        target: data.target ?? null,
        screen: {
            w: window.innerWidth || null,
            h: window.innerHeight || null,
        },
        ts: Date.now(),
    });

    if (queue.length >= FLUSH_AT_QUEUE_SIZE) {
        flush(false);
    }
};


// ============================================================
// LIFECYCLE
// ============================================================

export const startTracker = () => {
    if (started || typeof window === "undefined") {
        return;
    }

    started = true;

    intervalId = window.setInterval(() => {
        flush(false);
    }, FLUSH_INTERVAL_MS);

    const flushOnHide = () => {
        if (document.visibilityState === "hidden") {
            flush(true);
        }
    };

    window.addEventListener("visibilitychange", flushOnHide);
    window.addEventListener("pagehide", () => flush(true));
};


export const stopTracker = () => {
    if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
    }

    started = false;
};
