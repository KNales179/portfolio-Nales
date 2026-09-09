import { useState } from "react";


// ============================================================
// BAR SERIES
// ============================================================
//
// A single-series time chart: discrete counts over time
// (daily / hourly / monthly page views).
//
// - One measure, one hue (the portfolio accent). A single
//   series needs no legend — the title names it.
// - Square marks and a hairline baseline to match the admin
//   design system (sharp, minimal).
// - Per-bar hover tooltip.
//
// Props:
//   data     : [{ label: string, value: number }]
//   valueLabel : string  (e.g. "views") — used in the tooltip
// ============================================================

const VIEW_W = 720;
const VIEW_H = 200;
const PAD_TOP = 12;
const PAD_BOTTOM = 26;
const PAD_X = 4;


const niceCeil = (value) => {
    if (value <= 5) {
        return 5;
    }

    const magnitude = Math.pow(
        10,
        Math.floor(Math.log10(value))
    );

    const stepped = Math.ceil(value / magnitude) * magnitude;

    // Give the tallest bar a little headroom.
    return stepped === value
        ? stepped + magnitude
        : stepped;
};


function BarSeries({ data = [], valueLabel = "views" }) {
    const [hover, setHover] = useState(null);

    if (data.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center text-sm text-[var(--muted)]">
                No data for this period.
            </div>
        );
    }

    const maxValue = Math.max(
        ...data.map((point) => point.value),
        0
    );

    const axisMax = niceCeil(maxValue);

    const plotH = VIEW_H - PAD_TOP - PAD_BOTTOM;
    const slot = (VIEW_W - PAD_X * 2) / data.length;

    // Narrow bars with a clear gap — keeps the chart sharp and
    // avoids fat blocks on short periods.
    const barW = Math.max(
        2,
        Math.min(slot * 0.55, 26)
    );

    const total = data.reduce(
        (sum, point) => sum + point.value,
        0
    );

    // Label every Nth tick so the axis never collides.
    const labelEvery = Math.ceil(data.length / 12);

    return (
        <div className="relative">

            <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                className="w-full"
                role="img"
                aria-label={`${total} ${valueLabel} over ${data.length} intervals`}
                onMouseLeave={() => setHover(null)}
            >

                {/* baseline */}
                <line
                    x1={PAD_X}
                    x2={VIEW_W - PAD_X}
                    y1={PAD_TOP + plotH}
                    y2={PAD_TOP + plotH}
                    stroke="var(--border)"
                    strokeWidth="1"
                />

                {data.map((point, index) => {
                    const h =
                        axisMax === 0
                            ? 0
                            : (point.value / axisMax) * plotH;

                    const x =
                        PAD_X +
                        index * slot +
                        (slot - barW) / 2;

                    const y = PAD_TOP + plotH - h;

                    const isHover = hover === index;

                    return (
                        <g key={index}>

                            {/* full-height hit target */}
                            <rect
                                x={PAD_X + index * slot}
                                y={PAD_TOP}
                                width={slot}
                                height={plotH}
                                fill="transparent"
                                onMouseEnter={() =>
                                    setHover(index)
                                }
                            />

                            <rect
                                x={x}
                                y={y}
                                width={barW}
                                height={Math.max(h, point.value > 0 ? 2 : 0)}
                                fill="var(--accent)"
                                opacity={
                                    hover === null || isHover
                                        ? 1
                                        : 0.35
                                }
                                style={{ transition: "opacity 120ms" }}
                            />

                            {index % labelEvery === 0 && (
                                <text
                                    x={PAD_X + index * slot + slot / 2}
                                    y={VIEW_H - 8}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="var(--muted)"
                                >
                                    {point.label}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {hover !== null && (
                <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs shadow-lg"
                    style={{
                        left: `${
                            ((hover + 0.5) / data.length) * 100
                        }%`,
                        top: "8px",
                    }}
                >
                    <div className="font-semibold">
                        {data[hover].value} {valueLabel}
                    </div>
                    <div className="mt-0.5 text-[var(--muted)]">
                        {data[hover].fullLabel ||
                            data[hover].label}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BarSeries;
