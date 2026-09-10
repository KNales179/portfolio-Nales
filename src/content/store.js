// ============================================================
// CONTENT STORE
// ============================================================
//
// A tiny stale-while-revalidate cache for public content:
//
//   - in-memory cache, keyed by a string
//   - request deduplication (one network call for concurrent
//     readers of the same key)
//   - pub/sub so every component on a key re-renders together
//   - optimistic mutate() that returns a rollback function
//
// No IndexedDB / persistence yet — added later only if needed.
// ============================================================

const cache = new Map(); // key -> { data, ts }
const inflight = new Map(); // key -> Promise
const subscribers = new Map(); // key -> Set<fn>


export const getCached = (key) => cache.get(key);


const notify = (key) => {
    const subs = subscribers.get(key);

    if (!subs) {
        return;
    }

    const value = cache.get(key)?.data;

    for (const fn of subs) {
        fn(value);
    }
};


export const setCache = (key, data) => {
    cache.set(key, { data, ts: Date.now() });
    notify(key);
};


export const subscribe = (key, fn) => {
    if (!subscribers.has(key)) {
        subscribers.set(key, new Set());
    }

    subscribers.get(key).add(fn);

    return () => {
        subscribers.get(key)?.delete(fn);
    };
};


// Run `fetcher` at most once for a key while a call is in
// flight; all callers share the result.
export const fetchOnce = (key, fetcher) => {
    if (inflight.has(key)) {
        return inflight.get(key);
    }

    const promise = (async () => {
        try {
            const data = await fetcher();
            setCache(key, data);
            return data;
        } finally {
            inflight.delete(key);
        }
    })();

    inflight.set(key, promise);

    return promise;
};


// Optimistically replace the cached value. Returns a function
// that restores the previous value (call it if the server
// rejects the change).
export const mutate = (key, updater) => {
    const previous = cache.get(key)?.data;

    const next =
        typeof updater === "function"
            ? updater(previous)
            : updater;

    setCache(key, next);

    return () => {
        setCache(key, previous);
    };
};
