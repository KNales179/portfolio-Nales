import { motion } from "framer-motion";
import {
    LogOut,
    Menu,
    ShieldCheck,
    UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminNavbar({ onMenuToggle }) {
    const navigate = useNavigate();
    const { admin, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/portfolio-Nales/login", {
                replace: true,
            });
        }
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/85 shadow-lg shadow-black/5 backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16">

                {/* =========================
                    BRAND
                ========================== */}

                <div className="flex items-center gap-3">
                    {/* Mobile sidebar button */}

                    <button
                        type="button"
                        onClick={onMenuToggle}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 text-[var(--text)] transition hover:scale-105 hover:bg-purple-500/10 lg:hidden"
                        aria-label="Toggle admin navigation"
                    >
                        <Menu size={21} />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/portfolio-Nales/admin/dashboard")
                        }
                        className="group flex shrink-0 items-center gap-3"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}IBell.png`}
                            alt="I-Bell logo"
                            className="h-11 w-11 rounded-xl object-cover shadow-md shadow-purple-950/20 transition duration-300 group-hover:scale-105"
                        />

                        <div className="text-left">
                            <p className="heading-font text-lg font-bold leading-none text-[var(--text)] md:text-xl">
                                I-Bell
                            </p>

                            <p className="mt-1 text-xs text-purple-400/80">
                                Administration
                            </p>
                        </div>
                    </button>
                </div>

                {/* =========================
                    ADMIN INFO
                ========================== */}

                <div className="flex items-center gap-2 md:gap-4">

                    <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-2 sm:flex">
                        <ShieldCheck
                            size={17}
                            className="text-purple-400"
                        />

                        <div className="leading-tight">
                            <p className="text-xs font-medium text-[var(--text)]">
                                {admin?.fullName || "Administrator"}
                            </p>

                            <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                                {admin?.role || "ADMIN"}
                            </p>
                        </div>
                    </div>

                    {/* Profile */}

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() =>
                            navigate("/portfolio-Nales/admin/profile")
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 text-[var(--text)] transition hover:bg-purple-500/10"
                        aria-label="Profile"
                    >
                        <UserCircle size={21} />
                    </motion.button>

                    {/* Logout */}

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleLogout}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 text-[var(--text)] transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Logout"
                    >
                        <LogOut size={20} />
                    </motion.button>

                </div>
            </div>
        </header>
    );
}

export default AdminNavbar;