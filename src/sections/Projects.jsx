import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import projects from "../data/projects";
import ProjectManuscript from "../components/ProjectManuscript";


function ProjectCard({ project, index, className = "" }) {
  const [isActive, setIsActive] = useState(false);
  const [showManuscript, setShowManuscript] = useState(false);

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
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
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative min-h-0 min-w-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] ${className}`}
    >
      {/* Image */}
      <motion.img
        src={project.image}
        alt={`${project.name} preview`}
        animate={{
          scale: isActive ? 1.06 : 1,
          filter: isActive ? "blur(5px)" : "blur(0px)",
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Hover darkening */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
        aria-hidden="true"
      />

      {/* Active overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        animate={{
          opacity: isActive ? 0.6 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
        aria-hidden="true"
      />

      {/* Bottom project label */}
      <motion.div
        animate={{
          opacity: isActive ? 0 : 1,
          y: isActive ? 10 : 0,
        }}
        transition={{
          duration: 0.22,
        }}
        className="absolute inset-x-3 bottom-3"
      >
        <button
          type="button"
          onClick={() => setIsActive(true)}
          className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-black/55 px-3 py-2.5 text-left text-white backdrop-blur-md transition-colors duration-300 hover:bg-black/70"
        >
          <div className="min-w-0">
            <p className="truncate text-[8px] tracking-[0.14em] text-purple-300">
              {project.type}
            </p>

            <h3 className="heading-font truncate text-base font-semibold">
              {project.name}
            </h3>
          </div>

          <ArrowUpRight
            size={17}
            className="ml-2 shrink-0"
          />
        </button>
      </motion.div>

      {/* Details */}
      <motion.div
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.96,
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`absolute inset-3 flex items-center justify-center ${isActive
          ? "pointer-events-auto"
          : "pointer-events-none"
          }`}
      >
        <div className="relative w-full rounded-lg border border-white/15 bg-black/35 p-4 text-white shadow-2xl backdrop-blur-xl">

          {/* Close */}
          <button
            type="button"
            onClick={() => setIsActive(false)}
            aria-label={`Close ${project.name} details`}
            className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>

          {/* Number */}
          <p className="text-[8px] tracking-[0.2em] text-purple-300">
            {String(index + 1).padStart(2, "0")}
          </p>

          {/* Name */}
          <h3 className="heading-font mt-1 pr-8 text-lg font-bold md:text-xl">
            {project.name}
          </h3>

          {/* Type */}
          <p className="mt-0.5 text-[10px] text-white/50">
            {project.type}
          </p>

          {/* Description */}
          <p className="mt-2.5 text-[11px] leading-5 text-white/70 md:text-xs">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="mt-3 flex max-h-16 flex-wrap gap-1 overflow-hidden">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] text-white/60"
              >
                {technology}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowManuscript(true)}
            className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-purple-300 transition-colors hover:text-purple-200"
          >
            View project
            <ArrowUpRight size={12} />
          </button>
        </div>
      </motion.div>
      {showManuscript && (
        <ProjectManuscript
          project={project}
          onClose={() => setShowManuscript(false)}
        />
      )}
    </motion.article>
  );
}

function Projects() {
  /*
    Desktop layout:

    3 columns × 6 rows

    Column 1:
      Mobile #1 → rows 1-3
      Mobile #2 → rows 4-6

    Columns 2-3:
      Web #1 → rows 1-2
      Web #2 → rows 3-4
      Web #3 → rows 5-6
  */

  const showcaseProjects = projects.filter(
    (project) =>
      project.status === "complete" ||
      project.status === "incomplete"
  );

  const mobileProjects = showcaseProjects.filter(
    (project) => project.layout === "portrait"
  );

  const webProjects = showcaseProjects.filter(
    (project) => project.layout === "landscape"
  );
  return (
    <section
      id="projects"
      className="relative px-6 py-20 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1100px]">

        {/* Heading */}
        <SectionTitle
          label="Projects"
          title="Things I've Built"
          description="A few systems and applications I've worked on."
        />

        {/* ================================
            DESKTOP 3 × 6 GRID
        ================================= */}
        <div className="mt-10 hidden h-[820px] grid-cols-3 grid-rows-6 gap-2 md:grid">

          {/* Mobile #1 */}
          <ProjectCard
            project={mobileProjects[0]}
            index={showcaseProjects.indexOf(mobileProjects[0])}
            className="col-start-1 row-span-3 row-start-1"
          />

          {/* Mobile #2 */}
          <ProjectCard
            project={mobileProjects[1]}
            index={showcaseProjects.indexOf(mobileProjects[1])}
            className="col-start-1 row-span-3 row-start-4"
          />

          {/* Web #1 */}
          <ProjectCard
            project={webProjects[0]}
            index={showcaseProjects.indexOf(webProjects[0])}
            className="col-start-2 col-span-2 row-start-1 row-span-2"
          />

          {/* Web #2 */}
          <ProjectCard
            project={webProjects[1]}
            index={showcaseProjects.indexOf(webProjects[1])}
            className="col-start-2 col-span-2 row-start-3 row-span-2"
          />

          {/* Web #3 */}
          <ProjectCard
            project={webProjects[2]}
            index={showcaseProjects.indexOf(webProjects[2])}
            className="col-start-2 col-span-2 row-start-5 row-span-2"
          />
        </div>

        {/* ================================
            MOBILE LAYOUT
        ================================= */}
        <div className="mt-8 grid gap-3 md:hidden">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className={
                project.layout === "portrait"
                  ? "aspect-[3/4]"
                  : "aspect-[16/9]"
              }
            >
              <ProjectCard
                project={project}
                index={index}
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.4,
            duration: 0.5,
          }}
          className="mt-10 flex items-center justify-center gap-3 text-xs tracking-[0.2em] text-[var(--muted)]"
        >
          <span className="size-1.5 rounded-full bg-[var(--accent)]" />
          SELECT A PROJECT
          <span className="size-1.5 rounded-full bg-[var(--accent)]" />
        </motion.div>

      </div>
    </section>
  );
}

export default Projects;