import { motion } from "framer-motion";
import {
  BrainCircuit,
  Lightbulb,
  Rocket,
} from "lucide-react";

const strengths = [
  {
    icon: BrainCircuit,
    title: "Logical Thinking",
    description:
      "I focus on system logic, workflows, and solving real operational problems.",
  },
  {
    icon: Lightbulb,
    title: "Feature Planning",
    description:
      "I translate real-world requirements into practical application features.",
  },
  {
    icon: Rocket,
    title: "Independent Learning",
    description:
      "I independently learned technologies beyond the university curriculum.",
  },
];

function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center py-28 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            filter: "blur(8px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-4 flex items-center gap-3 font-medium text-purple-400">
            <span className="h-px w-10 bg-purple-400" />
            About Me
          </p>

          <h2 className="heading-font mb-8 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Building real systems through logic,
            planning, and continuous learning.
          </h2>

          <p className="max-w-4xl text-lg leading-8 opacity-75">
            I am a Mobile and Full Stack Developer with
            experience building transportation and records
            management systems. I independently learned React
            Native, Node.js, Express, API integration, and
            MongoDB beyond the university curriculum to create
            real-world solutions including TODA-GO and the
            Tricycle Integration Record System.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {strengths.map((strength, index) => {
            const Icon = strength.icon;

            return (
              <motion.div
                key={strength.title}
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
                  duration: 0.65,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
                className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-7 backdrop-blur-lg transition-shadow duration-300 hover:shadow-2xl hover:shadow-purple-950/10"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400">
                  <Icon size={24} />
                </div>

                <h3 className="heading-font mb-3 text-xl font-semibold">
                  {strength.title}
                </h3>

                <p className="leading-7 opacity-70">
                  {strength.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default About;