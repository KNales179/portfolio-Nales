import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import { useAuth } from "../../../context/AuthContext";
import { getCurrentAdmin } from "../../../services/authService";

import TwoFactorSection from "./TwoFactorSection";

function TwoFactor() {
    const { admin, setAdmin } = useAuth();

    // ============================================================
    // SIDEBAR
    // ============================================================

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    // ============================================================
    // PAGE
    // ============================================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ============================================================
    // 2FA
    // ============================================================

    const [twoFactorEnabled, setTwoFactorEnabled] =
        useState(false);

    // ============================================================
    // LOAD ADMIN
    // ============================================================

    useEffect(() => {
        loadAdmin();
    }, []);

    const loadAdmin = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getCurrentAdmin();

            const currentAdmin =
                response?.data?.admin ||
                response?.data ||
                response?.admin ||
                null;

            if (!currentAdmin) {
                throw new Error(
                    "Unable to load administrator information."
                );
            }

            setTwoFactorEnabled(
                Boolean(
                    currentAdmin.twoFactorEnabled
                )
            );

            if (setAdmin) {
                setAdmin(
                    currentAdmin
                );
            }
        } catch (error) {
            console.error(
                "Failed to load two-factor authentication status:",
                error
            );

            setError(
                error?.message ||
                    "Unable to load two-factor authentication settings."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // STATUS CHANGE
    // ============================================================

    const handleTwoFactorStatusChange = (
        enabled
    ) => {
        setTwoFactorEnabled(
            enabled
        );
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (current) => !current
                        )
                    }
                />

                <AdminSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                />

                <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                    <div className="flex min-h-[60vh] items-center justify-center">

                        <Loader2
                            size={28}
                            className="animate-spin text-purple-400"
                        />

                    </div>

                </main>

            </div>
        );
    }

    // ============================================================
    // PAGE
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
                            Authentication
                        </p>

                        <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                            Two-factor authentication.
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                            Manage your authenticator
                            app and two-factor
                            authentication protection.
                        </p>

                    </motion.div>

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mt-8 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* =================================================
                        2FA SECTION
                    ================================================== */}

                    {!error && (
                        <motion.div
                            className="mt-8"
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
                                delay: 0.05,
                            }}
                        >

                            <TwoFactorSection
                                enabled={
                                    twoFactorEnabled
                                }
                                admin={admin}
                                setAdmin={
                                    setAdmin
                                }
                                onStatusChange={
                                    handleTwoFactorStatusChange
                                }
                            />

                        </motion.div>
                    )}

                </div>

            </main>

        </div>
    );
}

export default TwoFactor;