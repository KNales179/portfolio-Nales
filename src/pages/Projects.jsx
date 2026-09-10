import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArchiveRestore, Plus, Trash2 } from "lucide-react";

import ProjectListCard from "../components/ProjectListCard";
import ProjectManuscript from "../components/ProjectManuscript";
import { useProjects } from "../content/useProjects";
import { useEditMode } from "../context/EditModeContext";
import DragHandle from "../components/edit/DragHandle";
import { useSortable } from "../components/edit/useSortable";
import { fetchAllProjects } from "../services/contentApi";


// ============================================================
// LOADING SKELETON
// ============================================================

function ProjectsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="border border-[var(--border)] bg-[var(--card)]"
        >
          <div className="skeleton aspect-[16/9] w-full" />
          <div className="space-y-3 p-6">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-6 w-40" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}


// ============================================================
// PAGE
// ============================================================

function Projects() {
  const [selectedId, setSelectedId] = useState(null);
  const [creating, setCreating] = useState(false);

  const { editing } = useEditMode();
  const {
    projects,
    loading,
    updateField,
    updateFields,
    reorder,
    create,
    archive,
    restore,
  } = useProjects();

  const handleCreate = async () => {
    setCreating(true);
    try {
      const saved = await create();
      if (saved?.id) {
        setSelectedId(saved.id);
      }
    } catch (error) {
      window.alert(
        error?.message || "Could not add the project."
      );
    } finally {
      setCreating(false);
    }
  };

  // Archived projects — fetched only in edit mode, then shown
  // inline in their status group as ghosted "restore me" cards.
  const [archived, setArchived] = useState([]);
  const [archivedLoaded, setArchivedLoaded] = useState(false);

  useEffect(() => {
    if (!editing || archivedLoaded) {
      return undefined;
    }
    let cancelled = false;
    fetchAllProjects()
      .then((all) => {
        if (!cancelled) {
          setArchived(all.filter((p) => p.archivedAt));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setArchivedLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [editing, archivedLoaded]);

  const handleArchive = async (project) => {
    if (
      !window.confirm(
        `Archive "${project.name}"? It will be hidden from the public site but you can restore it here.`
      )
    ) {
      return;
    }
    await archive(project.id);
    setArchived((list) => [
      ...list.filter((p) => p.id !== project.id),
      { ...project, archivedAt: new Date().toISOString() },
    ]);
    if (selectedId === project.id) {
      setSelectedId(null);
    }
  };

  const handleRestore = async (project) => {
    await restore(project.id);
    setArchived((list) =>
      list.filter((p) => p.id !== project.id)
    );
  };

  const archivedByStatus = useMemo(() => {
    const map = {};
    for (const project of archived) {
      (map[project.status] ||= []).push(project);
    }
    return map;
  }, [archived]);

  const sortable = useSortable(
    projects.map((project) => project.id),
    reorder
  );

  // Look the selection up from the live list so inline edits
  // show through in the open manuscript.
  const selectedProject =
    projects.find((project) => project.id === selectedId) ||
    null;

  const groups = [
    {
      key: "complete",
      title: "Completed",
      note: "Projects that have reached a completed development stage.",
    },
    {
      key: "incomplete",
      title: "In Development",
      note: "Projects that are currently being developed, improved, or expanded.",
    },
    {
      key: "planned",
      title: "Planned",
      note: "Projects I am planning to design and develop in the future.",
    },
  ];

  return (
    <section className="min-h-screen px-6 py-32 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1200px]">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-4">
            <h1 className="heading-font text-4xl font-bold tracking-tight md:text-5xl">
              <span className="text-[var(--accent)]">#</span>{" "}
              Projects
            </h1>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
            A collection of systems, applications, and development
            projects I have completed or am currently working on.
          </p>
        </motion.div>

        {editing && (
          <div className="mb-10">
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 border border-dashed border-[var(--accent)]/50 px-4 py-2 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/5 disabled:opacity-50"
            >
              <Plus size={15} />
              {creating ? "Adding…" : "Add project"}
            </button>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Creates a draft in “Planned”. Open it to fill in
              the details, images, and manuscript.
            </p>
          </div>
        )}

        {loading && projects.length === 0 ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 &&
          (!editing || archived.length === 0) ? (
          <div className="border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <p className="text-[var(--muted)]">
              {editing
                ? "No projects yet — use “Add project” above."
                : "No projects have been added yet."}
            </p>
          </div>
        ) : (
          groups.map((group) => {
            const items = projects.filter(
              (project) => project.status === group.key
            );
            const ghosts = editing
              ? archivedByStatus[group.key] || []
              : [];

            if (items.length === 0 && ghosts.length === 0) {
              return null;
            }

            return (
              <section key={group.key} className="mb-20">
                <div className="mb-8">
                  <div className="flex items-center gap-3">
                    <h2 className="heading-font text-3xl font-bold">
                      {group.title}
                    </h2>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)]">
                      {items.length}
                    </span>
                    {ghosts.length > 0 && (
                      <span className="rounded-full border border-dashed border-[var(--accent)]/40 px-2.5 py-1 text-xs text-[var(--accent)]">
                        {ghosts.length} archived
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {group.note}
                  </p>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((project, index) => (
                    <div
                      key={project.id}
                      {...sortable.getItemProps(project.id)}
                      className={`relative h-full rounded transition ${
                        sortable.overId === project.id
                          ? "outline outline-2 outline-offset-4 outline-[var(--accent)]"
                          : ""
                      } ${
                        sortable.draggingId === project.id
                          ? "opacity-40"
                          : ""
                      }`}
                    >
                      <DragHandle
                        {...sortable.dragHandleProps(
                          project.id
                        )}
                        className="absolute -left-2 -top-2 z-20 shadow-sm"
                      />

                      <ProjectListCard
                        project={project}
                        index={index}
                        onViewProject={(p) =>
                          setSelectedId(p.id)
                        }
                        onEditField={
                          editing
                            ? (field, value) =>
                                updateField(
                                  project.id,
                                  field,
                                  value
                                )
                            : undefined
                        }
                      />

                      {editing && (
                        <button
                          type="button"
                          onClick={() =>
                            handleArchive(project)
                          }
                          className="absolute right-3 top-3 z-10 flex items-center gap-1 border border-red-500/40 bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-red-400"
                        >
                          <Trash2 size={12} />
                          Archive
                        </button>
                      )}
                    </div>
                  ))}

                  {ghosts.map((project) => (
                    <div
                      key={project.id}
                      className="relative h-full rounded outline-dashed outline-2 outline-offset-2 outline-[var(--accent)]/40"
                      title="Archived — hidden from the public site"
                    >
                      <div className="pointer-events-none opacity-40 grayscale">
                        <ProjectListCard
                          project={project}
                          index={0}
                        />
                      </div>

                      <span className="absolute left-3 top-3 z-10 rounded bg-[var(--accent)]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                        Archived
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRestore(project)
                        }
                        className="absolute right-3 top-3 z-10 flex items-center gap-1 border border-[var(--accent)]/50 bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-[var(--accent)]"
                      >
                        <ArchiveRestore size={12} />
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}

      </div>

      {selectedProject && (
        <ProjectManuscript
          project={selectedProject}
          onClose={() => setSelectedId(null)}
          editing={editing}
          onEditField={
            editing
              ? (field, value) =>
                  updateField(
                    selectedProject.id,
                    field,
                    value
                  )
              : undefined
          }
          onEditFields={
            editing
              ? (patch) =>
                  updateFields(selectedProject.id, patch)
              : undefined
          }
        />
      )}
    </section>
  );
}

export default Projects;
