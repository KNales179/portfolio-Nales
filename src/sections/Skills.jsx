import { motion } from "framer-motion";
import {
  Cloud,
  Code2,
  Database,
  Server,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const skills = [
  {
    title: "Frontend",
    icon: Code2,
    items: [
      "React",
      "React Native",
      "JavaScript",
      "TypeScript",
    ],
  },
  {
    title: "Backend",
    icon: Server,
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "API Integration",
    ],
  },
  {
    title: "Database",
    icon: Database,
    items: [
      "MongoDB",
      "Mongoose",
      "MySQL",
      "Database Design",
    ],
  },
  {
    title: "Security",
    icon: ShieldCheck,
    items: [
      "JWT Authentication",
      "Role-Based Authorization",
      "Password Hashing",
      "Input Validation",
      "Activity Logs",
    ],
  },
  {
    title: "Deployment",
    icon: Cloud,
    items: [
      "Render",
      "MongoDB Atlas",
      "Expo",
      "Cloud Services",
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    items: [
      "Git",
      "GitHub",
      "Postman",
      "VS Code",
    ],
  },
];

function Skills() {
  return (
    <section
      id="skills"
      className="relative py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
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
            Skills
          </p>

          <h2 className="heading-font mb-4 text-4xl font-bold md:text-6xl">
            Technologies & Tools
          </h2>

          <p className="mb-14 max-w-2xl leading-7 opacity-70">
            Technologies I use to plan, develop, secure, and
            deploy full-stack applications.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => {
            const Icon = skill.icon;

            return (
              <motion.article
                key={skill.title}
                initial={{
                  opacity: 0,
                  y: 45,
                  scale: 0.97,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.015,
                }}
                className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-7 backdrop-blur-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-500/0 transition duration-500 group-hover:from-purple-400/5 group-hover:to-purple-500/10" />

                <div className="relative z-10">
                  <div className="mb-6 flex size-13 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 transition duration-300 group-hover:scale-110">
                    <Icon size={25} />
                  </div>

                  <h3 className="heading-font mb-5 text-2xl font-semibold">
                    {skill.title}
                  </h3>

                  <ul className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-3 py-1.5 text-sm opacity-80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;