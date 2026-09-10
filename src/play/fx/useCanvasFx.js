import { useEffect, useRef } from "react";


// ============================================================
// useCanvasFx
// ============================================================
//
// Wires a full-bleed <canvas> to a requestAnimationFrame loop:
//   - DPR-aware sizing (capped at 2×),
//   - pauses when the tab is hidden,
//   - honours prefers-reduced-motion (draws one static frame,
//     no loop).
//
// `draw(ctx, timeMs, { w, h, dpr })` runs each frame. Return
// the ref and put it on a <canvas className="h-full w-full">.
// ============================================================

export function useCanvasFx(draw) {
    const canvasRef = useRef(null);
    const drawRef = useRef(draw);

    useEffect(() => {
        drawRef.current = draw;
    }, [draw]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return undefined;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return undefined;
        }

        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let raf = 0;
        let running = true;
        let size = { w: 0, h: 0, dpr: 1 };

        const resize = () => {
            const dpr = Math.min(
                window.devicePixelRatio || 1,
                2
            );
            const w = canvas.clientWidth || window.innerWidth;
            const h =
                canvas.clientHeight || window.innerHeight;

            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            size = { w, h, dpr };
        };

        const frame = (time) => {
            if (!running) {
                return;
            }
            drawRef.current(ctx, time, size);
            if (!reduce) {
                raf = requestAnimationFrame(frame);
            }
        };

        const onVisibility = () => {
            running =
                document.visibilityState === "visible";
            if (running && !reduce) {
                raf = requestAnimationFrame(frame);
            }
        };

        resize();
        window.addEventListener("resize", resize);
        document.addEventListener(
            "visibilitychange",
            onVisibility
        );

        drawRef.current(ctx, performance.now(), size);
        if (!reduce) {
            raf = requestAnimationFrame(frame);
        }

        return () => {
            running = false;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            document.removeEventListener(
                "visibilitychange",
                onVisibility
            );
        };
    }, []);

    return canvasRef;
}
