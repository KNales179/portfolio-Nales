import { useCallback } from "react";

import { useContent } from "./useContent.js";
import { mutate } from "./store.js";
import {
    fetchProjects,
    patchProject,
    createProjectApi,
    archiveProjectApi,
    restoreProjectApi,
    reorderProjectsApi,
} from "../services/contentApi.js";


const KEY = "projects";


// ============================================================
// useProjects
// ============================================================
//
// Public projects with optimistic inline editing.
//
//   const { projects, loading, updateField } = useProjects();
//   await updateField(id, "description", "new text");
//
// updateField applies the change to the cache immediately, then
// PATCHes the server; on failure it rolls the cache back and
// re-throws so the caller can surface the error.
// ============================================================

export const useProjects = () => {
    const { data, loading, error, refreshing } = useContent(
        KEY,
        fetchProjects
    );

    const projects = data || [];

    const replaceOne = (id, next) =>
        mutate(KEY, (list) =>
            (list || []).map((project) =>
                project.id === id
                    ? typeof next === "function"
                        ? next(project)
                        : next
                    : project
            )
        );

    const updateField = useCallback(
        async (id, field, value) => {
            const rollback = replaceOne(id, (project) => ({
                ...project,
                [field]: value,
            }));

            try {
                const saved = await patchProject(id, {
                    [field]: value,
                });

                if (saved) {
                    replaceOne(id, saved);
                }
            } catch (err) {
                rollback();
                throw err;
            }
        },
        []
    );

    const updateFields = useCallback(async (id, patch) => {
        const rollback = replaceOne(id, (project) => ({
            ...project,
            ...patch,
        }));

        try {
            const saved = await patchProject(id, patch);

            if (saved) {
                replaceOne(id, saved);
            }
        } catch (err) {
            rollback();
            throw err;
        }
    }, []);

    // Apply a new ordering optimistically, then persist. `orderedIds`
    // is the full list of project ids in the desired order.
    const reorder = useCallback(async (orderedIds) => {
        const rollback = mutate(KEY, (list) => {
            const current = list || [];
            const byId = new Map(
                current.map((project) => [project.id, project])
            );
            const next = orderedIds
                .map((id, index) => {
                    const project = byId.get(id);
                    return project
                        ? { ...project, order: index + 1 }
                        : null;
                })
                .filter(Boolean);

            for (const project of current) {
                if (!orderedIds.includes(project.id)) {
                    next.push(project);
                }
            }

            return next;
        });

        try {
            await reorderProjectsApi(orderedIds);
        } catch (err) {
            rollback();
            throw err;
        }
    }, []);

    // Create a blank project (edit mode). It lands in "Planned"
    // so a half-filled draft isn't shown as completed work.
    const create = useCallback(
        async (name = "New project") => {
            const saved = await createProjectApi({
                name,
                status: "planned",
            });

            if (saved) {
                mutate(KEY, (list) => [
                    ...(list || []),
                    saved,
                ]);
            }

            return saved;
        },
        []
    );

    const archive = useCallback(async (id) => {
        const rollback = mutate(KEY, (list) =>
            (list || []).filter(
                (project) => project.id !== id
            )
        );

        try {
            await archiveProjectApi(id);
        } catch (err) {
            rollback();
            throw err;
        }
    }, []);

    const restore = useCallback(async (id) => {
        const saved = await restoreProjectApi(id);

        if (saved) {
            mutate(KEY, (list) => {
                const rest = (list || []).filter(
                    (project) => project.id !== id
                );

                return [...rest, saved].sort(
                    (a, b) =>
                        (a.order || 0) - (b.order || 0)
                );
            });
        }
    }, []);

    return {
        projects,
        loading,
        error,
        refreshing,
        updateField,
        updateFields,
        reorder,
        create,
        archive,
        restore,
    };
};
