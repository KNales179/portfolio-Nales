import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function ProjectCard({ project, index = 0, onViewCaseStudy }) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 60,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.85,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl"
    >
      <div className="grid lg:grid-cols-2">
        <div
          className={`relative min-h-[360px] overflow-hidden ${
            index % 2 === 1 ? "lg:order-2" : ""
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-purple-500/5" />

          <img
            src={project.image}
            alt={`${project.name} preview`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-center text-sm text-white/60 backdrop-blur-md">
              Add your project screenshots here
            </div>
          </div>
        </div>

        <div className="relative p-8 md:p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-purple-400">
            {project.type}
          </p>

          <h3 className="heading-font mb-5 text-3xl font-bold md:text-4xl">
            {project.name}
          </h3>

          <p className="mb-8 leading-8 opacity-75">
            {project.description}
          </p>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {project.features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 p-3"
                >
                  <Icon
                    size={18}
                    className="shrink-0 text-purple-400"
                  />

                  <span className="text-sm font-medium">
                    {feature.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium opacity-75"
              >
                {technology}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onViewCaseStudy?.(project)}
            className="group/button flex items-center gap-2 font-semibold text-purple-400"
          >
            View Case Study

            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-1"
            />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;