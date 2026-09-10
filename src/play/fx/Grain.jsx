import { useCallback } from "react";

import { useCanvasFx } from "./useCanvasFx";


// ============================================================
// GRAIN  (vintage fx layer)
// ============================================================
//
// A faint, restless film grain over the aged-paper background —
// scattered specks re-drawn each frame. Very low opacity so it
// reads as paper texture, not noise. Static under
// prefers-reduced-motion (useCanvasFx draws one frame).
// ============================================================

function Grain({ tint }) {
    const draw = useCallback(
        (ctx, time, { w, h }) => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = tint || "#3a2f22";
            ctx.globalAlpha = 0.045;

            const count = Math.floor((w * h) / 2600);
            for (let i = 0; i < count; i += 1) {
                ctx.fillRect(
                    Math.random() * w,
                    Math.random() * h,
                    1.4,
                    1.4
                );
            }
            ctx.globalAlpha = 1;
        },
        [tint]
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

export default Grain;
