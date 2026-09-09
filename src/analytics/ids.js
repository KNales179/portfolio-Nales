// ============================================================
// ANALYTICS — ANONYMOUS SESSION ID
// ============================================================
//
// A session groups the page views of a single visit. The id is
// random, stored only in sessionStorage, and is NOT a visitor
// identity — the backend estimates unique/returning visitors
// separately from device + IP.
//
// The session rotates after a period of inactivity so that a
// visitor who leaves a tab open for hours and comes back is
// counted as a new visit.
// ============================================================

const SESSION_KEY = "pa_session_id";
const SESSION_TS_KEY = "pa_session_ts";

// 30 minutes of inactivity ends the session.
const SESSION_IDLE_MS = 30 * 60 * 1000;


const createId = () => {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return (
        "s-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 10)
    );
};


const readStore = (key) => {
    try {
        return window.sessionStorage.getItem(key);
    } catch {
        return null;
    }
};


const writeStore = (key, value) => {
    try {
        window.sessionStorage.setItem(key, value);
    } catch {
        // Private mode / storage disabled — analytics simply
        // degrades to per-page-load sessions.
    }
};


// ============================================================
// GET SESSION ID
// ============================================================

export const getSessionId = () => {
    const now = Date.now();

    const existingId = readStore(SESSION_KEY);
    const lastSeen = Number(
        readStore(SESSION_TS_KEY)
    );

    const isFresh =
        existingId &&
        Number.isFinite(lastSeen) &&
        now - lastSeen < SESSION_IDLE_MS;

    const id = isFresh ? existingId : createId();

    writeStore(SESSION_KEY, id);
    writeStore(SESSION_TS_KEY, String(now));

    return id;
};


// ============================================================
// TOUCH SESSION
// ============================================================
//
// Extends the current session's activity window without
// generating a new id when one is still valid.
// ============================================================

export const touchSession = () => {
    writeStore(SESSION_TS_KEY, String(Date.now()));
};
