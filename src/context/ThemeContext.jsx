import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";


// ============================================================
// THEME CONTEXT
// ============================================================
//
// Site-wide light/dark preference, three states:
//
//   "system" — follows the OS (prefers-color-scheme). Default,
//              and what a first-time visitor sees. Nothing is
//              written to localStorage for this state.
//   "light"  — explicit override, persisted.
//   "dark"   — explicit override, persisted.
//
// The actual colours live entirely in src/index.css as CSS
// custom properties; this context's only job is to set/clear
// documentElement's `data-theme` attribute, which index.css's
// selectors key off. A blocking inline script in index.html
// applies any stored choice before first paint so there's no
// flash of the wrong theme.
// ============================================================

const STORAGE_KEY = "theme";

const readStored = () => {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value === "light" || value === "dark"
            ? value
            : "system";
    } catch {
        return "system";
    }
};

const ThemeContext = createContext(null);


export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(readStored);

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "system") {
            root.removeAttribute("data-theme");
        } else {
            root.setAttribute("data-theme", theme);
        }
    }, [theme]);

    const setTheme = useCallback((next) => {
        setThemeState(next);

        try {
            if (next === "system") {
                localStorage.removeItem(STORAGE_KEY);
            } else {
                localStorage.setItem(STORAGE_KEY, next);
            }
        } catch {
            // storage disabled — the choice just won't persist
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside a ThemeProvider"
        );
    }

    return context;
};
