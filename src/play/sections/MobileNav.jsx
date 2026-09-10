import { Link, useLocation } from "react-router-dom";
import {
    FolderGit2,
    Home,
    Mail,
    ScrollText,
    User,
} from "lucide-react";


// ============================================================
// MOBILE NAV  (all presets)
// ============================================================
//
// Every preset nav collapses its page links on small screens
// (they would overflow). This fixed bottom bar is the phone
// fallback — the same routes the desktop nav exposes — styled
// from the --play-* tokens so it matches whichever preset is
// active. Rendered once per surface (LayoutRenderer / Home /
// Page) next to the preset nav; hidden from `sm:` up.
// ============================================================

const ITEMS = [
    { to: "/", label: "Home", icon: Home },
    { to: "/projects", label: "Work", icon: FolderGit2 },
    {
        to: "/certificates",
        label: "Certs",
        icon: ScrollText,
    },
    { to: "/about", label: "About", icon: User },
    { to: "/contact", label: "Contact", icon: Mail },
];


function MobileNav() {
    const { pathname } = useLocation();

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-40 flex sm:hidden"
            style={{
                background: "var(--play-surface)",
                borderTop:
                    "var(--play-border-width, 1px) solid var(--play-border)",
                backdropFilter: "var(--play-blur, none)",
                WebkitBackdropFilter: "var(--play-blur, none)",
                paddingBottom: "env(safe-area-inset-bottom)",
            }}
        >
            {ITEMS.map(({ to, label, icon: Icon }) => {
                const active = pathname === to;
                return (
                    <Link
                        key={to}
                        to={to}
                        aria-current={
                            active ? "page" : undefined
                        }
                        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition"
                        style={{
                            color: active
                                ? "var(--play-accent)"
                                : "var(--play-muted)",
                        }}
                    >
                        <Icon size={17} />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default MobileNav;
