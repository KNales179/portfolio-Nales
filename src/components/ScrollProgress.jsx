import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useLocation } from "react-router-dom";

import { usePreset } from "../play/PresetContext";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const { livePreset } = usePreset();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.2,
  });

  // The Play page — and any preset-applied page — brings its
  // own presentation chrome.
  if (location.pathname === "/play" || livePreset) {
    return null;
  }

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