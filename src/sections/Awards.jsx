import { motion } from "framer-motion";
import {
  Award,
  HeartHandshake,
  Microscope,
  TrendingUp,
} from "lucide-react";

const awards = [
  {
    icon: Award,
    title: "Social Impact / Tech for Good Award",
    category: "Capstone Recognition",
    description:
      "Awarded to TODA-GO for focusing on meaningful societal and transportation improvements beyond a conventional CRUD-based capstone system.",
  },
  {
    icon: TrendingUp,
    title: "Most Improved Student",
    category: "BSIT Department",
    description:
      "Departmental recognition for significant academic, technical, and personal growth throughout the BSIT program.",
  },
  {
    icon: HeartHandshake,
    title: "Distinguished Departmental Service",
    category: "Service Recognition",
    description:
      "Recognition for an unparalleled record of service and exceptional devotion to the department.",
  },
  {
    icon: Microscope,
    title: "DLL Research Congress",
    category: "Research Participation",
    description:
      "Certificate of participation for presenting and representing technical research during the DLL Research Congress.",
  },
];

function Awards() {
  return (
    <section
      id="awards"
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
            Recognition
          </p>

          <h2 className="heading-font mb-4 text-4xl font-bold md:text-6xl">
            Awards & Achievements
          </h2>

          <p className="mb-14 max-w-2xl leading-7 opacity-70">
            Recognition for technical impact, academic
            improvement, service, and research participation.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {awards.map((award, index) => {
            const Icon = award.icon;

            return (
              <motion.article
                key={award.title}
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
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}
                className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-8 backdrop-blur-lg"
              >
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-purple-500/0 blur-3xl transition duration-500 group-hover:bg-purple-500/15" />

                <div className="relative z-10">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Icon size={27} />
                  </div>

                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-400">
                    {award.category}
                  </p>

                  <h3 className="heading-font mb-4 text-2xl font-bold">
                    {award.title}
                  </h3>

                  <p className="leading-7 opacity-70">
                    {award.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Awards;