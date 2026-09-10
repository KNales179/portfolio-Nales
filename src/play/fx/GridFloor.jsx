import { useCallback } from "react";

import { useCanvasFx } from "./useCanvasFx";


// ============================================================
// GRID FLOOR  (synthwave fx layer)
// ============================================================
//
// An infinite neon grid receding to a horizon, scrolling toward
// the viewer, with a glowing sun above it. Pure geometry.
// ============================================================

function GridFloor({ accent, glow }) {
    const draw = useCallback(
        (ctx, time, { w, h }) => {
            ctx.clearRect(0, 0, w, h);

            const horizon = h * 0.42;
            const t = (time / 1000) % 1;

            // --- sun -------------------------------------------
            const sunR = Math.min(w, h) * 0.16;
            const sunX = w / 2;
            const sunY = horizon - sunR * 0.35;

            const sun = ctx.createLinearGradient(
                0,
                sunY - sunR,
                0,
                sunY + sunR
            );
            sun.addColorStop(0, glow);
            sun.addColorStop(1, accent);

            ctx.save();
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
            ctx.clip();
            ctx.fillStyle = sun;
            ctx.fillRect(
                sunX - sunR,
                sunY - sunR,
                sunR * 2,
                sunR * 2
            );
            // scanline bands across the lower half of the sun
            ctx.fillStyle = "rgba(0,0,0,0.55)";
            for (let i = 0; i < 7; i += 1) {
                const bandY =
                    sunY + (i / 7) * sunR + (i * 2);
                ctx.fillRect(
                    sunX - sunR,
                    bandY,
                    sunR * 2,
                    Math.max(2, 6 - i)
                );
            }
            ctx.restore();

            // --- grid -----------------------------------------
            ctx.strokeStyle = accent;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.55;

            // horizontal lines, exponentially spaced, scrolling
            const rows = 14;
            for (let i = 0; i < rows; i += 1) {
                const p = (i + t) / rows;
                const y = horizon + Math.pow(p, 2) * (h - horizon);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // vertical lines converging to the vanishing point
            const cols = 16;
            for (let i = 0; i <= cols; i += 1) {
                const x = (i / cols) * w;
                ctx.beginPath();
                ctx.moveTo(x, h);
                ctx.lineTo(w / 2, horizon);
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
        },
        [accent, glow]
    );

    const ref = useCanvasFx(draw);

    return (
        <canvas
            ref={ref}
            className="h-full w-full"
            aria-hidden="true"
        />
    );
}

export default GridFloor;
