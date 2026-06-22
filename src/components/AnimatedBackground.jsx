import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

function AnimatedBackground() {
  const { scrollYProgress } = useScroll();

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 20,
    mass: 0.9,
  });

  const beamMoveY = useTransform(smoothScroll, [0, 1], ["0%", "22%"]);
  const beamMoveX = useTransform(smoothScroll, [0, 1], ["0%", "-10%"]);
  const beamRotate = useTransform(smoothScroll, [0, 1], [-8, 8]);

  return (
    <div className="portfolio-bg" aria-hidden="true">
      <motion.div
        className="purple-beam beam-main"
        style={{
          y: beamMoveY,
          x: beamMoveX,
          rotate: beamRotate,
        }}
      />

      <motion.div
        className="purple-beam beam-secondary"
        style={{
          y: useTransform(smoothScroll, [0, 1], ["0%", "-18%"]),
          x: useTransform(smoothScroll, [0, 1], ["0%", "8%"]),
        }}
      />

      <motion.div
        className="purple-glow glow-left"
        animate={{
          x: [0, 60, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="purple-glow glow-right"
        animate={{
          x: [0, -80, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="bg-vignette" />
    </div>
  );
}

export default AnimatedBackground;