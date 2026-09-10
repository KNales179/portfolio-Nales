import { useCallback } from "react";

import { useCanvasFx } from "./useCanvasFx";


// ============================================================
// NEON GRID  (cyberpunk fx layer)
// ============================================================
//
// A receding perspective grid — floor and ceiling — with a
// bright horizontal scan beam sweeping down the frame and a few
// vertical light conduits pulsing. Blade-Runner UI, not code
// rain.
// ============================================================

function withAlpha(hex, a) {
    const v = String(hex || "").replace("#", "");
    const f =
        v.length === 3
            ? v.split("").map((c) => c + c).join("")
            : v.padEnd(6, "0").slice(0, 6);
    const r = parseInt(f.slice(0, 2), 16) || 0;
    const g = parseInt(f.slice(2, 4), 16) || 0;
    const b = parseInt(f.slice(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}


function NeonGrid({ accent, accent2, bg }) {
    const draw = useCallback(
        (ctx, time, { w, h }) => {
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            const horizon = h * 0.52;
            const t = (time / 1000) % 1;

            // radial haze at the horizon
            const haze = ctx.createRadialGradient(
                w / 2,
                horizon,
                0,
                w / 2,
                horizon,
                Math.max(w, h) * 0.6
            );
            haze.addColorStop(0, withAlpha(accent2, 0.16));
            haze.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = haze;
            ctx.fillRect(0, 0, w, h);

            // --- floor grid --------------------------------
            const drawPlane = (dir, color, rows) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                for (let i = 0; i < rows; i += 1) {
                    const p = (i + t) / rows;
                    const eased = Math.pow(p, 2.2);
                    const y =
                        horizon +
                        dir * eased * (h - horizon) * 1.05;
                    ctx.globalAlpha =
                        (1 - p) * 0.5 + 0.05;
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }

                const cols = 22;
                for (let i = 0; i <= cols; i += 1) {
                    const x = (i / cols) * w;
                    ctx.globalAlpha = 0.28;
                    ctx.beginPath();
                    ctx.moveTo(x, horizon + dir * (h - horizon));
                    ctx.lineTo(w / 2, horizon);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            };

            drawPlane(1, withAlpha(accent, 0.9), 18);
            drawPlane(-1, withAlpha(accent2, 0.6), 12);

            // --- vertical light conduits ------------------
            const conduits = 5;
            for (let i = 0; i < conduits; i += 1) {
                const x =
                    ((i + 0.5) / conduits) * w +
                    Math.sin(time * 0.0004 + i) * 20;
                const pulse =
                    0.15 +
                    0.25 *
                        (0.5 +
                            0.5 *
                                Math.sin(
                                    time * 0.002 + i * 2
                                ));
                ctx.fillStyle = withAlpha(accent, pulse);
                ctx.fillRect(x - 1, 0, 2, h);
            }

            // --- scan beam --------------------------------
            const beamY =
                ((time * 0.06) % (h + 200)) - 100;
            const beam = ctx.createLinearGradient(
                0,
                beamY - 60,
                0,
                beamY + 60
            );
            beam.addColorStop(0, "rgba(0,0,0,0)");
            beam.addColorStop(0.5, withAlpha(accent, 0.22));
            beam.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = beam;
            ctx.fillRect(0, beamY - 60, w, 120);
            ctx.fillStyle = withAlpha(accent, 0.5);
            ctx.fillRect(0, beamY, w, 1);

            // --- scanlines + vignette --------------------
            ctx.fillStyle = "rgba(0,0,0,0.16)";
            for (let y = 0; y < h; y += 3) {
                ctx.fillRect(0, y, w, 1);
            }

            const vg = ctx.createRadialGradient(
                w / 2,
                h / 2,
                Math.min(w, h) * 0.3,
                w / 2,
                h / 2,
                Math.max(w, h) * 0.75
            );
            vg.addColorStop(0, "rgba(0,0,0,0)");
            vg.addColorStop(1, "rgba(0,0,0,0.55)");
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, w, h);
        },
        [accent, accent2, bg]
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

export default NeonGrid;
