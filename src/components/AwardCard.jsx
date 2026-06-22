import { motion } from "framer-motion";

function AwardCard({
  icon: Icon,
  title,
  category,
  description,
  index = 0,
}) {
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
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-purple-500/0 blur-3xl transition duration-300 group-hover:bg-purple-500/15" />

      <div className="relative z-10">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 transition duration-200 group-hover:rotate-6 group-hover:scale-110">
          <Icon size={27} />
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-400">
          {category}
        </p>

        <h3 className="heading-font mb-4 text-2xl font-bold">
          {title}
        </h3>

        <p className="leading-7 opacity-70">
          {description}
        </p>
      </div>
    </motion.article>
  );
}

export default AwardCard;