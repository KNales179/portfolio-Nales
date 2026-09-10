import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArchiveRestore, Trash2 } from "lucide-react";

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
// ARCHIVED PROJECTS (edit mode only)
// ============================================================

function ArchivedProjects({ restore }) {
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const all = await fetchAllProjects();
      setArchived(all.filter((p) => p.archivedAt));
    } catch {
      setArchived([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  if (loading || archived.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 border-t border-dashed border-[var(--border)] pt-10">
      <h2 className="heading-font text-xl font-bold text-[var(--muted)]">
        Archived ({archived.length})
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Hidden from the public site. Restore to bring one back.
      </p>

      <div className="mt-6 space-y-2">
        {archived.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 border border-[var(--border)] bg-[var(--card)] px-4 py-3"
          >
            <span className="text-sm font-medium">
              {project.name}
            </span>
            <button
              type="button"
              onClick={async () => {
                await restore(project.id);
                setArchived((list) =>
                  list.filter((p) => p.id !== project.id)
                );
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]"
            >
              <ArchiveRestore size={14} />
              Restore
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}


// ============================================================
// PAGE
// ============================================================

function Projects() {
  const [selectedId, setSelectedId] = useState(null);

  const { editing } = useEditMode();
  const {
    projects,
    loading,
    updateField,
    updateFields,
    reorder,
    archive,
    restore,
  } = useProjects();

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

        {loading && projects.length === 0 ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 ? (
          <div className="border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <p className="text-[var(--muted)]">
              No projects have been added yet.
            </p>
          </div>
        ) : (
          groups.map((group) => {
            const items = projects.filter(
              (project) => project.status === group.key
            );

            if (items.length === 0) {
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
                          onClick={() => {
                            if (
                              window.confirm(
                                `Archive "${project.name}"? It will be hidden from the public site but you can restore it.`
                              )
                            ) {
                              archive(project.id);
                            }
                          }}
                          className="absolute right-3 top-3 z-10 flex items-center gap-1 border border-red-500/40 bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-red-400"
                        >
                          <Trash2 size={12} />
                          Archive
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}

        {editing && (
          <ArchivedProjects restore={restore} />
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
