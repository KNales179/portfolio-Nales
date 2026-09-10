import { useCallback } from "react";

import { useCanvasFx } from "./useCanvasFx";


// ============================================================
// RISO DOTS  (maximalism fx layer)
// ============================================================
//
// A drifting two-colour halftone field — big offset dot grids
// in the accent colours, sliding slowly in opposite directions
// like mis-registered risograph print. Kept low-opacity so type
// stays readable over it.
// ============================================================

function RisoDots({ accent, accent2, bg }) {
    const draw = useCallback(
        (ctx, time, { w, h }) => {
            ctx.clearRect(0, 0, w, h);
            if (bg) {
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, w, h);
            }

            const t = time / 1000;
            const gap = 34;
            const r = 6;

            const layer = (color, dx, dy, alpha) => {
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                const ox = ((dx % gap) + gap) % gap;
                const oy = ((dy % gap) + gap) % gap;
                for (let x = -gap; x < w + gap; x += gap) {
                    for (
                        let y = -gap;
                        y < h + gap;
                        y += gap
                    ) {
                        ctx.beginPath();
                        ctx.arc(
                            x + ox,
                            y + oy,
                            r,
                            0,
                            Math.PI * 2
                        );
                        ctx.fill();
                    }
                }
            };

            layer(accent, t * 6, Math.sin(t * 0.3) * 20, 0.12);
            layer(
                accent2,
                gap / 2 - t * 5,
                gap / 2 + Math.cos(t * 0.25) * 18,
                0.1
            );

            ctx.globalAlpha = 1;
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

export default RisoDots;
