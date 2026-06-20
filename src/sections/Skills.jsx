import { motion } from "framer-motion";

const skills = [
  {
    title: "Frontend",
    items: ["React", "React Native", "JavaScript", "TypeScript"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST API"],
  },
  {
    title: "Database",
    items: ["MongoDB", "Mongoose"],
  },
  {
    title: "Security",
    items: [
      "JWT Authentication",
      "Authorization",
      "Password Hashing",
      "Validation",
      "Activity Logs",
    ],
  },
  {
    title: "Deployment",
    items: ["Render", "Cloud Services"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Postman", "VS Code"],
  },
];

function Skills() {
  return (
    <section id="skills" className="py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        <p className="text-purple-400 mb-4">
          Skills
        </p>

        <h2 className="heading-font text-4xl font-bold mb-12">
          Technologies & Tools
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {skills.map((skill) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border p-6 hover:-translate-y-2 transition"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="font-semibold text-xl mb-4">
                {skill.title}
              </h3>

              <ul className="space-y-2 opacity-80">
                {skill.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Skills;