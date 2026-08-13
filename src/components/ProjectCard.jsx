import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function ProjectCard({ project, index = 0, onViewCaseStudy }) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 40,
        filter: "blur(6px)",
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
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group
        overflow-hidden
        border
        border-[var(--border)]
        bg-[var(--card)]/70
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-purple-500/30
        hover:shadow-xl
        hover:shadow-purple-950/10
      "
    >
      <div className="grid lg:grid-cols-2">

        {/* =========================
            PROJECT IMAGE
        ========================== */}
        <div
          className={`
            relative
            min-h-[300px]
            overflow-hidden
            border-b
            border-[var(--border)]
            lg:min-h-[340px]
            lg:border-b-0
            ${index % 2 === 1
              ? "lg:order-2 lg:border-l"
              : "lg:border-r"
            }
          `}
        >
          {/* Image */}
          <img
            src={project.image}
            alt={`${project.name} preview`}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-[1.035]
            "
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-purple-950/10" />

          {/* Project type */}
          <div className="absolute left-5 top-5">
            <span className="
              inline-flex
              border
              border-white/15
              bg-black/30
              px-3
              py-1.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-white/80
              backdrop-blur-md
            ">
              {project.type}
            </span>
          </div>
        </div>

        {/* =========================
            PROJECT INFORMATION
        ========================== */}
        <div className="flex flex-col justify-between p-7 md:p-9">

          <div>

            {/* Title */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="
                heading-font
                text-2xl
                font-bold
                tracking-tight
                md:text-3xl
              ">
                {project.name}
              </h3>

              {/* Status */}
              {project.status && (
                <span
                  className={`
                    shrink-0
                    border
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    ${project.status === "complete"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                    }
                  `}
                >
                  {project.status === "complete"
                    ? "Completed"
                    : "In Development"}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="
              max-w-xl
              text-sm
              leading-7
              text-[var(--muted)]
            ">
              {project.description}
            </p>

            {/* Features */}
            {project.features?.length > 0 && (
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {project.features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.label}
                      className="
                        flex
                        items-center
                        gap-2.5
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]/40
                        px-3
                        py-2.5
                      "
                    >
                      {Icon && (
                        <Icon
                          size={16}
                          className="shrink-0 text-purple-400"
                        />
                      )}

                      <span className="text-xs font-medium">
                        {feature.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Technologies */}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="
                    border
                    border-[var(--border)]
                    px-2.5
                    py-1
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-[var(--muted)]
                  "
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          {/* =========================
              CASE STUDY
          ========================== */}
          <div className="mt-8 border-t border-[var(--border)] pt-5">
            <button
              type="button"
              onClick={() => onViewCaseStudy?.(project)}
              className="
                group/button
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-purple-400
                transition-colors
                hover:text-purple-300
              "
            >
              View Case Study

              <ArrowUpRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover/button:translate-x-1
                  group-hover/button:-translate-y-1
                "
              />
            </button>
          </div>

        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;