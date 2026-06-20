import { motion } from "framer-motion";

const milestones = [
  {
    year: "2023",
    title: "Started Advanced Web Development",
    description:
      "Expanded beyond classroom projects and explored modern web technologies.",
  },
  {
    year: "2024",
    title: "Learned Backend Development",
    description:
      "Studied APIs, databases, authentication, and full-stack architecture.",
  },
  {
    year: "2025",
    title: "Developed TODA-GO",
    description:
      "Built a transportation platform with mobile apps, backend services, and admin dashboard.",
  },
  {
    year: "2026",
    title: "Built TIRS & Graduated",
    description:
      "Developed records management systems and completed BSIT studies.",
  },
];

function Journey() {
  return (
    <section id="journey" className="py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        <p className="text-purple-400 mb-4">
          Development Journey
        </p>

        <h2 className="heading-font text-4xl font-bold mb-12">
          Growth Timeline
        </h2>

        <div className="space-y-8">
          {milestones.map((item) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-purple-400 font-semibold">
                {item.year}
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {item.title}
              </h3>

              <p className="opacity-80 mt-3">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Journey;