// ============================================================
// contrast  —  tiny colour maths, no library
// ============================================================
//
// Just enough to (a) show a live WCAG contrast readout in the
// customise panel and (b) nudge a visitor-picked colour until
// it is readable on the preset background.
// ============================================================

// Parse #rgb / #rrggbb / rgb() / rgba() → { r, g, b } (0-255) or null.
export function parseColor(input) {
    if (!input || typeof input !== "string") {
        return null;
    }
    const s = input.trim();

    const hex = s.replace(/^#/, "");
    if (/^[0-9a-f]{3}$/i.test(hex)) {
        return {
            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16),
        };
    }
    if (/^[0-9a-f]{6}$/i.test(hex)) {
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
        };
    }

    const m = s.match(
        /^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i
    );
    if (m) {
        return {
            r: Number(m[1]),
            g: Number(m[2]),
            b: Number(m[3]),
        };
    }
    return null;
}

export function toHex({ r, g, b }) {
    const h = (n) =>
        Math.max(0, Math.min(255, Math.round(n)))
            .toString(16)
            .padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
}

const channel = (c) => {
    const v = c / 255;
    return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
};

export function luminance(rgb) {
    if (!rgb) {
        return 0;
    }
    return (
        0.2126 * channel(rgb.r) +
        0.7152 * channel(rgb.g) +
        0.0722 * channel(rgb.b)
    );
}

// WCAG contrast ratio (1–21). Accepts colour strings.
export function contrastRatio(a, b) {
    const la = luminance(parseColor(a));
    const lb = luminance(parseColor(b));
    const hi = Math.max(la, lb);
    const lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
}

// "AAA" | "AA" | "AA Large" | "Fail" for normal-weight text.
export function contrastGrade(ratio) {
    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AA";
    if (ratio >= 3) return "AA Large";
    return "Fail";
}

// --- rgb <-> hsl -------------------------------------------
export function rgbToHsl({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    const d = max - min;
    if (d !== 0) {
        s = d / (1 - Math.abs(2 * l - 1));
        switch (max) {
            case r:
                h = ((g - b) / d) % 6;
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            default:
                h = (r - g) / d + 4;
        }
        h *= 60;
        if (h < 0) h += 360;
    }
    return { h, s, l };
}

export function hslToRgb({ h, s, l }) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let rgb;
    if (h < 60) rgb = [c, x, 0];
    else if (h < 120) rgb = [x, c, 0];
    else if (h < 180) rgb = [0, c, x];
    else if (h < 240) rgb = [0, x, c];
    else if (h < 300) rgb = [x, 0, c];
    else rgb = [c, 0, x];

    return {
        r: (rgb[0] + m) * 255,
        g: (rgb[1] + m) * 255,
        b: (rgb[2] + m) * 255,
    };
}

// Linear blend: `t` is the amount (0–1) of `b` mixed into `a`.
export function mix(a, b, t) {
    const ca = parseColor(a);
    const cb = parseColor(b);
    if (!ca || !cb) {
        return a;
    }
    return toHex({
        r: ca.r + (cb.r - ca.r) * t,
        g: ca.g + (cb.g - ca.g) * t,
        b: ca.b + (cb.b - ca.b) * t,
    });
}

// Black or white — whichever is readable on `color`.
export function pickContrast(color) {
    return luminance(parseColor(color)) > 0.45
        ? "#111111"
        : "#ffffff";
}

// Turn one chosen background into a coherent core palette:
// bg / surface / card / border / text / muted. Light vs dark is
// decided from the background's luminance; an explicit `text`
// colour (if the visitor set one) is respected.
export function derivePalette(bg, { text } = {}) {
    const rgb = parseColor(bg);
    if (!rgb) {
        return {};
    }
    const dark = luminance(rgb) < 0.4;
    const ink =
        text || (dark ? "#f4f4f6" : "#161616");

    return {
        "--play-bg": toHex(rgb),
        "--play-surface": mix(
            bg,
            "#ffffff",
            dark ? 0.05 : 0.5
        ),
        "--play-card": mix(
            bg,
            "#ffffff",
            dark ? 0.08 : 0.78
        ),
        "--play-border": mix(bg, ink, 0.26),
        "--play-text": ink,
        "--play-muted": mix(ink, bg, 0.42),
    };
}

// Push `color` lighter or darker (whichever direction the
// background needs) until it clears `target` contrast on `bg`,
// keeping hue + saturation. Returns a hex string.
export function ensureReadable(color, bg, target = 4.5) {
    const rgb = parseColor(color);
    if (!rgb) {
        return color;
    }
    if (contrastRatio(color, bg) >= target) {
        return toHex(rgb);
    }

    const bgLum = luminance(parseColor(bg));
    const hsl = rgbToHsl(rgb);
    // dark bg → lighten the colour; light bg → darken it
    const step = bgLum < 0.5 ? 0.03 : -0.03;

    let { l } = hsl;
    for (let i = 0; i < 40; i += 1) {
        l = Math.max(0, Math.min(1, l + step));
        const candidate = toHex(
            hslToRgb({ h: hsl.h, s: hsl.s, l })
        );
        if (contrastRatio(candidate, bg) >= target) {
            return candidate;
        }
        if (l === 0 || l === 1) {
            break;
        }
    }
    return toHex(hslToRgb({ h: hsl.h, s: hsl.s, l }));
}
