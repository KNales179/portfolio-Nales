import { useCallback } from "react";

import { useCanvasFx } from "./useCanvasFx";


// ============================================================
// BLUEPRINT GRID  (blueprint fx layer)
// ============================================================
//
// Graph paper: a fine grid with a brighter coarse grid over it,
// drifting a few pixels so it feels alive without moving. Cyan
// lines on the navy preset background.
// ============================================================

function BlueprintGrid({ accent, bg }) {
    const draw = useCallback(
        (ctx, time, { w, h }) => {
            ctx.clearRect(0, 0, w, h);
            if (bg) {
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, w, h);
            }

            const drift = Math.sin(time / 6000) * 6;
            const fine = 26;
            const coarse = 130;

            ctx.strokeStyle = accent;
            ctx.lineWidth = 1;

            const lines = (step, alpha) => {
                ctx.globalAlpha = alpha;
                const o = ((drift % step) + step) % step;
                for (let x = o; x < w; x += step) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
                for (let y = o; y < h; y += step) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
            };

            lines(fine, 0.07);
            lines(coarse, 0.2);
            ctx.globalAlpha = 1;
        },
        [accent, bg]
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

export default BlueprintGrid;
