import { motion, useReducedMotion } from "framer-motion";


// ============================================================
// HOLO MESH  (holographic fx layer)
// ============================================================
//
// Two huge, heavily-blurred iridescent gradient discs turning
// at different speeds behind the content — the ambient foil
// shimmer the holo surfaces sit on. No canvas; pure CSS + one
// slow rotation.
// ============================================================

const IRIS =
    "conic-gradient(from 0deg at 50% 50%, #ff9cf0, #7af5e0, #a99cff, #ffe29c, #ff77c8, #7af5e0, #ff9cf0)";

function HoloMesh() {
    const reduce = useReducedMotion();

    const disc = (extra) => ({
        position: "absolute",
        borderRadius: "50%",
        backgroundImage: IRIS,
        filter: "blur(90px) saturate(1.3)",
        opacity: 0.5,
        ...extra,
    });

    return (
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                aria-hidden="true"
                style={disc({
                    width: "70vw",
                    height: "70vw",
                    top: "-18vw",
                    left: "-12vw",
                })}
                animate={
                    reduce ? undefined : { rotate: 360 }
                }
                transition={{
                    duration: 48,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <motion.div
                aria-hidden="true"
                style={disc({
                    width: "60vw",
                    height: "60vw",
                    bottom: "-22vw",
                    right: "-14vw",
                    opacity: 0.4,
                })}
                animate={
                    reduce ? undefined : { rotate: -360 }
                }
                transition={{
                    duration: 62,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
}

export default HoloMesh;
