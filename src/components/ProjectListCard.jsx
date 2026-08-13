import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";

function ProjectListCard({ project, index = 0 }) {
  const isComplete = project.status === "complete";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden border border-[var(--border)] bg-[var(--card)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-950/10"
    >
      {/* IMAGE */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface)]">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.name} preview`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            No preview available
          </div>
        )}

        {/* STATUS */}
        <div className="absolute left-4 top-4">
          <span
            className={`flex items-center gap-2 border px-3 py-1.5 text-xs font-medium backdrop-blur-md ${isComplete
                ? "border-emerald-400/30 bg-emerald-950/80 text-emerald-300"
                : "border-amber-400/30 bg-amber-950/80 text-amber-300"
              }`}
          >
            {isComplete ? (
              <CheckCircle2 size={13} />
            ) : (
              <Clock3 size={13} />
            )}

            {isComplete ? "Completed" : "In Development"}
          </span>
        </div>

        {/* IMAGE OVERLAY */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-30" />
      </div>

      {/* CONTENT */}
      <div className="p-6 md:p-7">
        {/* TYPE */}
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">
          {project.type}
        </p>

        {/* TITLE */}
        <h3 className="heading-font text-2xl font-bold tracking-tight">
          {project.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {project.description}
        </p>

        {/* TECHNOLOGIES */}
        {project.technologies?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {technology}
              </span>
            ))}
          </div>
        )}

        {/* ACTION */}
        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
          <button
            type="button"
            className="group/button flex items-center gap-2 text-sm font-semibold text-purple-400 transition-colors hover:text-purple-300"
          >
            View Project

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
            />
          </button>

          {/* PROJECT STATUS LABEL */}
          <span className="text-xs uppercase tracking-wider text-[var(--muted)]">
            {isComplete ? "Finished" : "Ongoing"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectListCard;