import { motion } from "framer-motion";

const directions = {
  up: {
    x: 0,
    y: 50,
  },
  down: {
    x: 0,
    y: -50,
  },
  left: {
    x: 50,
    y: 0,
  },
  right: {
    x: -50,
    y: 0,
  },
};

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) {
  const offset = directions[direction] || directions.up;

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        filter: "blur(8px)",
        ...offset,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.18,
      }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;