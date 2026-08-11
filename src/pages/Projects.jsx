import { motion } from "framer-motion";
import ProjectListCard from "../components/ProjectListCard";
import projects from "../data/projects";

function Projects() {
  const completedProjects = projects.filter(
    (project) => project.status === "complete"
  );

  const incompleteProjects = projects.filter(
    (project) => project.status === "incomplete"
  );

  return (
    <section className="min-h-screen px-6 py-32 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1200px]">

        {/* =========================
            PAGE HEADER
        ========================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
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

        {/* =========================
            COMPLETED
        ========================== */}
        {completedProjects.length > 0 && (
          <section className="mb-20">
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <h2 className="heading-font text-3xl font-bold">
                  Completed
                </h2>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)]">
                  {completedProjects.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Projects that have reached a completed development stage.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedProjects.map((project, index) => (
                <ProjectListCard
                  key={project.name}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* =========================
            IN DEVELOPMENT
        ========================== */}
        {incompleteProjects.length > 0 && (
          <section>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <h2 className="heading-font text-3xl font-bold">
                  In Development
                </h2>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)]">
                  {incompleteProjects.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Projects that are currently being developed,
                improved, or expanded.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {incompleteProjects.map((project, index) => (
                <ProjectListCard
                  key={project.name}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* =========================
            EMPTY STATE
        ========================== */}
        {projects.length === 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <p className="text-[var(--muted)]">
              No projects have been added yet.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default Projects;