import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "../context/ThemeContext";


// ============================================================
// THEME TOGGLE
// ============================================================
//
// A compact three-way switch — System / Light / Dark — for the
// site-wide colour scheme (src/context/ThemeContext.jsx). Drop
// into any navbar; sizing matches the surrounding h-11 icon
// buttons.
// ============================================================

const OPTIONS = [
    { value: "system", label: "Use system theme", icon: Monitor },
    { value: "light", label: "Light theme", icon: Sun },
    { value: "dark", label: "Dark theme", icon: Moon },
];

function ThemeToggle({ className = "" }) {
    const { theme, setTheme } = useTheme();

    return (
        <div
            role="radiogroup"
            aria-label="Colour theme"
            className={`inline-flex h-11 items-center gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-1 backdrop-blur-md ${className}`}
        >
            {OPTIONS.map(({ value, label, icon: Icon }) => {
                const active = theme === value;

                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={label}
                        title={label}
                        onClick={() => setTheme(value)}
                        className={`flex h-full w-8 items-center justify-center rounded-lg transition ${
                            active
                                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                                : "text-[var(--text)]/55 hover:bg-[var(--surface)] hover:text-[var(--text)]"
                        }`}
                    >
                        <Icon size={15} />
                    </button>
                );
            })}
        </div>
    );
}

export default ThemeToggle;
