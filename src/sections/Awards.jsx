import { motion } from "framer-motion";

const awards = [
  {
    title: "Social Impact / Tech for Good Award",
    description:
      "Awarded for TODA-GO's contribution to transportation modernization.",
  },
  {
    title: "Most Improved Student",
    description:
      "Recognition for significant academic and technical growth.",
  },
  {
    title: "Distinguished Departmental Service",
    description:
      "Awarded for dedication and contribution to the department.",
  },
  {
    title: "DLL Research Congress",
    description:
      "Certificate of participation in research and innovation activities.",
  },
];

function Awards() {
  return (
    <section id="awards" className="py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        <p className="text-purple-400 mb-4">
          Recognition
        </p>

        <h2 className="heading-font text-4xl font-bold mb-12">
          Awards & Achievements
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {awards.map((award) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="text-xl font-bold mb-3">
                {award.title}
              </h3>

              <p className="opacity-80">
                {award.description}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Awards;