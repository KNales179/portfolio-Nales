import { motion, useReducedMotion } from "framer-motion";


// ============================================================
// MESH GRADIENT  (aurora fx layer)
// ============================================================
//
// Three large, heavily-blurred colour fields drifting slowly on
// mirrored paths — a calm gradient sky the content floats over.
// Pure CSS; no canvas.
// ============================================================

function MeshGradient({ colors }) {
    const reduce = useReducedMotion();
    const [a, b, c] = colors;

    const blob = (color, style, anim, dur) => (
        <motion.div
            aria-hidden="true"
            style={{
                position: "absolute",
                borderRadius: "50%",
                background: color,
                filter: "blur(80px)",
                opacity: 0.7,
                ...style,
            }}
            animate={reduce ? undefined : anim}
            transition={{
                duration: dur,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            }}
        />
    );

    return (
        <div className="absolute inset-0 overflow-hidden">
            {blob(
                a,
                {
                    width: "56vw",
                    height: "56vw",
                    top: "-12vw",
                    left: "-8vw",
                },
                { x: ["0vw", "8vw"], y: ["0vh", "6vh"] },
                19
            )}
            {blob(
                b,
                {
                    width: "48vw",
                    height: "48vw",
                    bottom: "-14vw",
                    right: "-6vw",
                },
                { x: ["0vw", "-7vw"], y: ["0vh", "-5vh"] },
                23
            )}
            {blob(
                c,
                {
                    width: "42vw",
                    height: "42vw",
                    top: "28vh",
                    left: "34vw",
                },
                { x: ["0vw", "6vw"], y: ["0vh", "-6vh"] },
                27
            )}
        </div>
    );
}

export default MeshGradient;
