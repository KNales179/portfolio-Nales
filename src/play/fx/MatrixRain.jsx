import { useCallback, useRef } from "react";

import { useCanvasFx } from "./useCanvasFx";


// ============================================================
// MATRIX RAIN  (cyberpunk fx layer)
// ============================================================
//
// Columns of falling glyphs with a fading trail. Colours are
// passed in from the active preset. Drawn behind all content.
// ============================================================

const GLYPHS =
    "ｱｲｳｴｵｶｷｸｹｺ0123456789ﾊﾋﾌﾍﾎABCDEF<>/\\*+-=$#@%";

function MatrixRain({ accent, bg }) {
    const drops = useRef([]);
    const last = useRef(0);

    const draw = useCallback(
        (ctx, time, { w, h }) => {
            const fontSize = 16;
            const columns = Math.max(
                1,
                Math.floor(w / fontSize)
            );

            if (drops.current.length !== columns) {
                drops.current = Array.from(
                    { length: columns },
                    () => Math.random() * -40
                );
            }

            // Fade the previous frame → the trail.
            ctx.fillStyle = withAlpha(bg, 0.09);
            ctx.fillRect(0, 0, w, h);

            const step = time - last.current > 45;
            if (step) {
                last.current = time;
            }

            ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

            for (let i = 0; i < columns; i += 1) {
                const y = drops.current[i] * fontSize;
                const char =
                    GLYPHS[
                        (Math.random() * GLYPHS.length) | 0
                    ];

                // Bright head, dim tail.
                ctx.fillStyle = withAlpha(accent, 0.9);
                ctx.fillText(char, i * fontSize, y);
                ctx.fillStyle = withAlpha(accent, 0.28);
                ctx.fillText(
                    GLYPHS[
                        (Math.random() * GLYPHS.length) | 0
                    ],
                    i * fontSize,
                    y - fontSize
                );

                if (step) {
                    if (
                        y > h &&
                        Math.random() > 0.975
                    ) {
                        drops.current[i] = 0;
                    } else {
                        drops.current[i] += 1;
                    }
                }
            }
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


// Accepts #rgb / #rrggbb; returns an rgba() string.
function withAlpha(hex, alpha) {
    const value = String(hex || "").replace("#", "");
    const full =
        value.length === 3
            ? value
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : value.padEnd(6, "0").slice(0, 6);

    const r = parseInt(full.slice(0, 2), 16) || 0;
    const g = parseInt(full.slice(2, 4), 16) || 0;
    const b = parseInt(full.slice(4, 6), 16) || 0;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default MatrixRain;
