import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Shield,
    Smartphone,
    KeyRound,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";

function Settings() {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    // ============================================================
    // SETTINGS ITEMS
    // ============================================================

    const settingsItems = [
        {
            title: "Profile",
            description:
                "Manage your personal information and profile image.",
            icon: User,
            path: "/portfolio-Nales/admin/profile",
        },

        {
            title: "Security",
            description:
                "Manage your password and administrator account security.",
            icon: Shield,
            path: "/portfolio-Nales/admin/settings/security",
        },

        {
            title: "Two-factor authentication",
            description:
                "Protect your administrator account with an authenticator app.",
            icon: Smartphone,
            path: "/portfolio-Nales/admin/settings/two-factor",
        },

        {
            title: "Trusted devices",
            description:
                "View and manage devices that are trusted for your account.",
            icon: KeyRound,
            path: "/portfolio-Nales/admin/settings/trusted-devices",
        },
    ];

    // ============================================================
    // LAYOUT
    // ============================================================

    return (
        <div className="min-h-screen bg-[var(--surface)]">

            {/* ====================================================
                NAVBAR
            ==================================================== */}

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen(
                        (current) => !current
                    )
                }
            />

            {/* ====================================================
                SIDEBAR
            ==================================================== */}

            <AdminSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            {/* ====================================================
                MAIN
            ==================================================== */}

            <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-12">

                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                    >

                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                            Administration
                        </p>

                        <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                            Settings.
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                            Manage your administrator
                            account, authentication,
                            and security preferences.
                        </p>

                    </motion.div>

                    {/* =================================================
                        SETTINGS GRID
                    ================================================== */}

                    <div className="mt-8 grid gap-4 md:grid-cols-2">

                        {settingsItems.map(
                            (
                                item,
                                index
                            ) => {
                                const Icon =
                                    item.icon;

                                return (
                                    <motion.button
                                        key={
                                            item.title
                                        }
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                item.path
                                            )
                                        }
                                        initial={{
                                            opacity: 0,
                                            y: 15,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay:
                                                0.05 +
                                                index *
                                                0.05,
                                        }}
                                        className="group flex w-full items-start gap-4 border border-[var(--border)] bg-[var(--card)] p-6 text-left transition hover:border-purple-500/40 hover:bg-[var(--card)]"
                                    >

                                        {/* ICON */}

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-purple-500/10 text-purple-400 transition group-hover:bg-purple-500/15">

                                            <Icon
                                                size={20}
                                            />

                                        </div>

                                        {/* CONTENT */}

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-center justify-between gap-4">

                                                <h2 className="text-base font-semibold">
                                                    {
                                                        item.title
                                                    }
                                                </h2>

                                                <ChevronRight
                                                    size={18}
                                                    className="shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-purple-400"
                                                />

                                            </div>

                                            <p className="mt-1 max-w-lg text-sm leading-6 text-[var(--muted)]">
                                                {
                                                    item.description
                                                }
                                            </p>

                                        </div>

                                    </motion.button>
                                );
                            }
                        )}

                    </div>

                    {/* =================================================
                        ACCOUNT SECTION
                    ================================================== */}

                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: 0.25,
                        }}
                        className="mt-8 border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                    >

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-purple-500/10 text-purple-400">

                                <KeyRound
                                    size={20}
                                />

                            </div>

                            <div>

                                <h2 className="text-base font-semibold">
                                    Account
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                    Manage administrator
                                    account information
                                    and account-level
                                    actions.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/portfolio-Nales/admin/settings/account"
                                )
                            }
                            className="mt-5 flex items-center gap-2 text-sm font-semibold text-purple-400 transition hover:text-purple-300"
                        >

                            Manage account

                            <ChevronRight
                                size={16}
                            />

                        </button>

                    </motion.section>

                </div>

            </main>

        </div>
    );
}

export default Settings;