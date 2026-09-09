// ============================================================
// ANALYTICS — INTERACTION HELPERS
// ============================================================
//
// Fire-and-forget helpers for component-level interaction
// tracking. They resolve the current public route themselves,
// so a component only needs to say what happened.
//
//   import { trackInteraction, trackLink } from "../analytics/track";
//   onClick={() => trackInteraction("PROJECT_OPENED", project.title)}
//   onClick={() => trackLink(href, "LinkedIn")}
//
// Nothing here records anything that identifies a visitor.
// ============================================================

import { track } from "./tracker.js";


// ============================================================
// CURRENT ROUTE (HashRouter)
// ============================================================

const currentPath = () => {
    if (typeof window === "undefined") {
        return "/";
    }

    const hash = window.location.hash || "";
    const bare = hash.replace(/^#\/?/, "").split(/[?#]/)[0];

    if (!bare) {
        return "/";
    }

    return ("/" + bare).replace(/\/+$/, "") || "/";
};


const isPublicPath = (path) => {
    const lower = (path || "").toLowerCase();

    return (
        lower.startsWith("/") &&
        lower !== "/login" &&
        lower !== "/admin" &&
        !lower.startsWith("/admin/")
    );
};


// ============================================================
// TRACK INTERACTION
// ============================================================

export const trackInteraction = (action, target = null) => {
    const path = currentPath();

    if (!isPublicPath(path)) {
        return;
    }

    track("INTERACTION", {
        path,
        action,
        target:
            target === null || target === undefined
                ? null
                : String(target).slice(0, 300),
    });
};


// ============================================================
// TRACK LINK
// ============================================================
//
// Classifies an outbound link and records the appropriate
// interaction. `label` is a friendly target (e.g. "LinkedIn");
// it falls back to the link's domain.
// ============================================================

const domainOf = (href) => {
    try {
        return new URL(
            href,
            window.location.href
        ).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
};


export const trackLink = (href, label = null) => {
    if (typeof href !== "string" || href.length === 0) {
        return;
    }

    if (href.startsWith("mailto:")) {
        trackInteraction(
            "EMAIL_CLICK",
            label || href.replace(/^mailto:/, "")
        );
        return;
    }

    const domain = domainOf(href);

    if (domain && domain.includes("github.com")) {
        trackInteraction("GITHUB_CLICK", label || domain);
        return;
    }

    trackInteraction(
        "EXTERNAL_LINK_CLICK",
        label || domain || href
    );
};
