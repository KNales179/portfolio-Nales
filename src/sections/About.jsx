import { motion } from "framer-motion";
import {
  BrainCircuit,
  Lightbulb,
  Rocket,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";

const strengths = [
  {
    icon: BrainCircuit,
    title: "Logical Thinking",
    description:
      "I focus on workflows, system logic, and solving problems in a structured way.",
  },
  {
    icon: Lightbulb,
    title: "Feature Planning",
    description:
      "I turn real user needs into practical features that make the system useful and easier to manage.",
  },
  {
    icon: Rocket,
    title: "Continuous Learning",
    description:
      "I learn new tools and technologies when a project requires them, instead of limiting myself to what I already know.",
  },
];

function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center py-28 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
        <SectionTitle
          label="About Me"
          title="Building practical systems through logic, planning, and continuous learning."
          description="I am a Mobile and Full Stack Developer who enjoys building practical systems based on real-world problems. I started with basic programming and gradually learned mobile development, backend APIs, databases, authentication, and cloud-based tools through hands-on projects. My completed works include TODA-GO and the Tricycle Integration Record System, but I am not limited to one type of system—I am willing to learn and adapt based on what each project requires."
        />

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
                className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-7 backdrop-blur-lg transition-shadow duration-100 hover:shadow-2xl hover:shadow-purple-950/10"
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