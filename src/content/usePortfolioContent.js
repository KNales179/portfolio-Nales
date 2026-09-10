import { useCallback } from "react";

import { useContent } from "./useContent.js";
import { mutate } from "./store.js";
import {
    fetchAllContent,
    patchContentItem,
    createContentItem,
    archiveContentItem,
    restoreContentItem,
    reorderContentItems,
    patchSiteText,
    uploadResume,
} from "../services/contentApi.js";


const KEY = "portfolio-content";

const EMPTY = {
    skills: [],
    journey: [],
    awards: [],
    hobbies: [],
    certificates: [],
    contactLinks: [],
    strengths: [],
    text: {},
};

// The API route segment ("contact-links") differs from the key
// it lands under in the /api/content payload ("contactLinks").
// Every optimistic cache write goes through this.
const CACHE_KEY = {
    "contact-links": "contactLinks",
};

const cacheKeyFor = (type) => CACHE_KEY[type] || type;


// ============================================================
// usePortfolioContent
// ============================================================
//
// One stale-while-revalidate hydration of every editable
// section, plus optimistic inline-edit helpers.
//
//   const { content, updateItem, updateText } =
//       usePortfolioContent();
//
//   updateItem("journey", id, { title: "..." })
//   updateText("hero", { role: "..." })
// ============================================================

export const usePortfolioContent = () => {
    const { data, loading, error, refreshing } = useContent(
        KEY,
        fetchAllContent
    );

    const content = { ...EMPTY, ...(data || {}) };

    const patchList = (type, id, next) => {
        const key = cacheKeyFor(type);
        return mutate(KEY, (current) => {
            const base = current || EMPTY;
            return {
                ...base,
                [key]: (base[key] || []).map((item) =>
                    item.id === id
                        ? typeof next === "function"
                            ? next(item)
                            : next
                        : item
                ),
            };
        });
    };

    const updateItem = useCallback(
        async (type, id, patch) => {
            const rollback = patchList(
                type,
                id,
                (item) => ({ ...item, ...patch })
            );

            try {
                const saved = await patchContentItem(
                    type,
                    id,
                    patch
                );
                if (saved) {
                    patchList(type, id, saved);
                }
            } catch (err) {
                rollback();
                throw err;
            }
        },
        []
    );

    const updateText = useCallback(async (key, patch) => {
        const rollback = mutate(KEY, (current) => {
            const base = current || EMPTY;
            return {
                ...base,
                text: {
                    ...base.text,
                    [key]: {
                        ...(base.text?.[key] || {}),
                        ...patch,
                    },
                },
            };
        });

        try {
            const values = await patchSiteText(key, patch);
            mutate(KEY, (current) => ({
                ...(current || EMPTY),
                text: {
                    ...(current?.text || {}),
                    [key]: values,
                },
            }));
        } catch (err) {
            rollback();
            throw err;
        }
    }, []);

    // Replace the résumé PDF. The upload endpoint persists the
    // new URL on the "site" key; we then patch it into the cache
    // so every résumé link updates without a refetch.
    const replaceResume = useCallback(async (file) => {
        const resumeUrl = await uploadResume(file);

        mutate(KEY, (current) => {
            const base = current || EMPTY;
            return {
                ...base,
                text: {
                    ...base.text,
                    site: {
                        ...(base.text?.site || {}),
                        resumeUrl,
                    },
                },
            };
        });

        return resumeUrl;
    }, []);

    const archiveItem = useCallback(async (type, id) => {
        const key = cacheKeyFor(type);
        const rollback = mutate(KEY, (current) => {
            const base = current || EMPTY;
            return {
                ...base,
                [key]: (base[key] || []).filter(
                    (item) => item.id !== id
                ),
            };
        });

        try {
            await archiveContentItem(type, id);
        } catch (err) {
            rollback();
            throw err;
        }
    }, []);

    const restoreItem = useCallback(async (type, id) => {
        const saved = await restoreContentItem(type, id);
        if (!saved) {
            return;
        }
        const key = cacheKeyFor(type);
        mutate(KEY, (current) => {
            const base = current || EMPTY;
            const rest = (base[key] || []).filter(
                (item) => item.id !== id
            );
            return {
                ...base,
                [key]: [...rest, saved].sort(
                    (a, b) =>
                        (a.order || 0) - (b.order || 0)
                ),
            };
        });
    }, []);

    // Optimistically apply a new item order, then persist it.
    const reorderItems = useCallback(
        async (type, orderedIds) => {
            const key = cacheKeyFor(type);

            const rollback = mutate(KEY, (current) => {
                const base = current || EMPTY;
                const list = base[key] || [];
                const byId = new Map(
                    list.map((item) => [item.id, item])
                );
                const next = orderedIds
                    .map((id) => byId.get(id))
                    .filter(Boolean);
                // keep anything the caller didn't mention
                for (const item of list) {
                    if (!orderedIds.includes(item.id)) {
                        next.push(item);
                    }
                }
                return { ...base, [key]: next };
            });

            try {
                await reorderContentItems(type, orderedIds);
            } catch (err) {
                rollback();
                throw err;
            }
        },
        []
    );

    const createItem = useCallback(
        async (type, payload) => {
            const key = cacheKeyFor(type);
            const saved = await createContentItem(
                type,
                payload
            );
            if (saved) {
                mutate(KEY, (current) => {
                    const base = current || EMPTY;
                    return {
                        ...base,
                        [key]: [
                            ...(base[key] || []),
                            saved,
                        ],
                    };
                });
            }
            return saved;
        },
        []
    );

    return {
        content,
        loading,
        error,
        refreshing,
        updateItem,
        updateText,
        replaceResume,
        archiveItem,
        restoreItem,
        reorderItems,
        createItem,
    };
};
