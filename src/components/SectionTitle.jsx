import { motion } from "framer-motion";

function SectionTitle({
  label,
  title,
  description,
  align = "left",
}) {
  const isCenter = align === "center";

  return (
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
      className={isCenter ? "mx-auto text-center" : ""}
    >
      <p
        className={`mb-4 flex items-center gap-3 font-medium text-purple-400 ${
          isCenter ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-10 bg-purple-400" />
        {label}
        {isCenter && <span className="h-px w-10 bg-purple-400" />}
      </p>

      <h2 className="heading-font mb-4 text-4xl font-bold leading-tight md:text-6xl">
        {title}
      </h2>

      {description && (
        <p
          className={`leading-7 opacity-70 ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default SectionTitle;