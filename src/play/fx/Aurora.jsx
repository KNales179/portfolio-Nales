import { useCallback, useRef } from "react";

import { useCanvasFx } from "./useCanvasFx";


// ============================================================
// AURORA  (glassmorphism fx layer)
// ============================================================
//
// A few very large, soft, slowly-drifting colour blobs. Heavily
// blurred so the frosted-glass panels above have something
// living to refract.
// ============================================================

function Aurora({ colors }) {
    const blobs = useRef(null);

    const draw = useCallback(
        (ctx, time, { w, h }) => {
            if (!blobs.current) {
                blobs.current = colors.map((color, i) => ({
                    color,
                    x: 0.25 + Math.random() * 0.5,
                    y: 0.25 + Math.random() * 0.5,
                    r: 0.5 + Math.random() * 0.2,
                    ax: 0.06 + Math.random() * 0.05,
                    ay: 0.05 + Math.random() * 0.05,
                    speed: 0.05 + Math.random() * 0.04,
                    phase: i * 2.1,
                }));
            }

            ctx.clearRect(0, 0, w, h);
            ctx.filter = `blur(${Math.round(
                Math.min(w, h) * 0.11
            )}px)`;

            const min = Math.min(w, h);
            const t = time * 0.001;

            for (const b of blobs.current) {
                const cx =
                    (b.x +
                        Math.sin(t * b.speed + b.phase) *
                            b.ax) *
                    w;
                const cy =
                    (b.y +
                        Math.cos(
                            t * b.speed * 0.8 + b.phase
                        ) *
                            b.ay) *
                    h;
                const radius = b.r * min;

                const g = ctx.createRadialGradient(
                    cx,
                    cy,
                    0,
                    cx,
                    cy,
                    radius
                );
                g.addColorStop(0, b.color);
                g.addColorStop(0.5, b.color);
                g.addColorStop(1, "rgba(0,0,0,0)");

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.filter = "none";
        },
        [colors]
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

export default Aurora;
