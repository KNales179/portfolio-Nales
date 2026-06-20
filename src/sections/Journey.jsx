import { motion } from "framer-motion";

const milestones = [
  {
    year: "2023",
    title: "Started Advanced Web Development",
    description:
      "Expanded beyond classroom projects and explored modern web-development technologies.",
  },
  {
    year: "2024",
    title: "Learned Backend Development",
    description:
      "Studied APIs, databases, authentication, frontend-backend integration, and full-stack architecture.",
  },
  {
    year: "2025",
    title: "Developed TODA-GO",
    description:
      "Built a transportation platform with passenger and driver mobile apps, backend services, and a web-based admin dashboard.",
  },
  {
    year: "2026",
    title: "Completed Major Systems",
    description:
      "Completed TODA-GO and the Tricycle Integration Record System, presented the project, and graduated from the BSIT program.",
  },
];

function Journey() {
  return (
    <section
      id="journey"
      className="relative py-28 md:py-36"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <p className="mb-4 flex items-center gap-3 font-medium text-purple-400">
            <span className="h-px w-10 bg-purple-400" />
            Development Journey
          </p>

          <h2 className="heading-font mb-16 text-4xl font-bold md:text-6xl">
            Growth Timeline
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-purple-400 via-purple-700 to-transparent md:left-1/2"
            initial={{
              scaleY: 0,
            }}
            whileInView={{
              scaleY: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 1.4,
              ease: "easeOut",
            }}
          />

          <div className="space-y-12">
            {milestones.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -45 : 45,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                className={`relative grid md:grid-cols-2 ${
                  index % 2 === 0
                    ? ""
                    : "md:text-right"
                }`}
              >
                <div
                  className={`pl-12 md:pl-0 ${
                    index % 2 === 0
                      ? "md:pr-14"
                      : "md:order-2 md:pl-14"
                  }`}
                >
                  <motion.div
                    whileHover={{
                      y: -6,
                    }}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-7 backdrop-blur-lg"
                  >
                    <p className="mb-2 text-sm font-bold tracking-widest text-purple-400">
                      {item.year}
                    </p>

                    <h3 className="heading-font mb-3 text-2xl font-bold">
                      {item.title}
                    </h3>

                    <p className="leading-7 opacity-70">
                      {item.description}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  className="absolute left-0 top-8 size-6 rounded-full border-4 border-[var(--bg)] bg-purple-500 shadow-lg shadow-purple-500/30 md:left-1/2 md:-translate-x-1/2"
                  whileInView={{
                    scale: [0, 1.3, 1],
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1 + 0.2,
                    duration: 0.5,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Journey;