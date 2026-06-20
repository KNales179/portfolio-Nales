import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.2,
  });

  return (
    <motion.div
      className="
        fixed
        left-0
        right-0
        top-0
        z-[70]
        h-[3px]
        origin-left
        bg-gradient-to-r
        from-violet-400
        via-fuchsia-400
        to-purple-500
      "
      style={{ scaleX }}
    />
  );
}

export default ScrollProgress;