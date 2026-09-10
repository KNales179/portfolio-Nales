import { useEffect, useState } from "react";

import {
    getCached,
    subscribe,
    fetchOnce,
} from "./store.js";


// ============================================================
// useContent
// ============================================================
//
// Stale-while-revalidate read of a content key.
//
//   const { data, loading, error, refreshing } =
//       useContent("projects", fetchProjects);
//
// - cached value renders immediately; a background refetch runs
// - `loading` is true only on a true cold start (no cache)
// - `refreshing` is true while a background refetch is running
// - on a failed refetch, cached data is kept and `error` is set
// ============================================================

export const useContent = (key, fetcher) => {
    const [data, setData] = useState(
        () => getCached(key)?.data ?? null
    );
    const [loading, setLoading] = useState(
        () => !getCached(key)
    );
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribe(key, (value) => {
            setData(value ?? null);
        });

        const hadCache = Boolean(getCached(key));

        // Re-sync from cache when the key changes.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(getCached(key)?.data ?? null);
        setLoading(!hadCache);
        setRefreshing(hadCache);

        let cancelled = false;

        fetchOnce(key, fetcher)
            .then(() => {
                if (!cancelled) {
                    setError(null);
                }
            })
            .catch((err) => {
                if (cancelled) {
                    return;
                }

                // Keep showing cached content on a failed refresh.
                if (!getCached(key)) {
                    setError(err);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                    setRefreshing(false);
                }
            });

        return () => {
            cancelled = true;
            unsubscribe();
        };
        // `fetcher` is expected to be a stable module function.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return { data, loading, error, refreshing };
};
