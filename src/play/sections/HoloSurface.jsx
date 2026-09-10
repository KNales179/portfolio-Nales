import { useState } from "react";


// ============================================================
// HoloSurface  (holographic preset)
// ============================================================
//
// A surface with a holo-foil finish: an iridescent gradient
// (`--play-iris`) whose position shifts as the pointer moves
// across it, plus a white specular highlight that tracks the
// cursor. Wrap any card / panel / button in it.
// ============================================================

export function HoloSurface({
    as: Tag = "div",
    className = "",
    contentClassName = "",
    style,
    children,
    foilOpacity = 0.42,
    ...rest
}) {
    const [p, setP] = useState({ x: 50, y: 50, on: false });

    const onMove = (event) => {
        const r =
            event.currentTarget.getBoundingClientRect();
        setP({
            x: ((event.clientX - r.left) / r.width) * 100,
            y: ((event.clientY - r.top) / r.height) * 100,
            on: true,
        });
    };

    const onLeave = () =>
        setP((s) => ({ ...s, on: false }));

    return (
        <Tag
            {...rest}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`relative overflow-hidden ${className}`}
            style={{ ...style, isolation: "isolate" }}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 transition-opacity duration-300"
                style={{
                    backgroundImage: "var(--play-iris)",
                    backgroundSize: "240% 240%",
                    backgroundPosition: `${p.x}% ${p.y}%`,
                    mixBlendMode: "color-dodge",
                    opacity: p.on ? foilOpacity : foilOpacity * 0.5,
                }}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle at ${p.x}% ${p.y}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 42%)`,
                    opacity: p.on ? 0.55 : 0,
                }}
            />
            <div className={`relative ${contentClassName}`}>
                {children}
            </div>
        </Tag>
    );
}

export default HoloSurface;
