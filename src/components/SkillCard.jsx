import { motion } from "framer-motion";

function SkillCard({ title, icon: Icon, items, index = 0 }) {
  return (
    <motion.article
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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-500/0 transition duration-100 group-hover:from-purple-400/5 group-hover:to-purple-500/10" />

      <div className="relative z-10">
        <div className="mb-6 flex size-13 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 transition duration-100 group-hover:scale-110">
          <Icon size={25} />
        </div>

        <h3 className="heading-font mb-5 text-2xl font-semibold">
          {title}
        </h3>

        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
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
}

export default SkillCard;