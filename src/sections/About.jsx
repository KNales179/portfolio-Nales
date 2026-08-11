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
    <div>
      <SectionTitle
        label="About Me"
        title="Building practical systems through logic, planning, and continuous learning."
        description="I’m a Full Stack Developer who enjoys both building and experimenting 
        with technology. I love creating interactive interfaces and experiences on the frontend, 
        but I’m especially interested in what happens behind them—the logic, data, APIs, and 
        systems that make everything work. For me, a good application isn’t just about how it 
        looks; I care just as much about what happens underneath and whether the whole thing 
        actually works the way it should."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {strengths.map((strength, index) => {
          const Icon = strength.icon;

          return (
            <motion.article
              key={strength.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -5,
              }}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/30 hover:shadow-xl hover:shadow-purple-950/10"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-transform duration-300 group-hover:scale-105">
                <Icon size={21} strokeWidth={1.8} />
              </div>

              <h3 className="heading-font text-xl font-semibold">
                {strength.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {strength.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export default About;