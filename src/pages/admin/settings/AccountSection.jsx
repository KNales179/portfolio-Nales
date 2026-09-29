import { motion } from "framer-motion";
import {
    UserRound,
    Mail,
    ShieldCheck,
    Trash2,
    ChevronLeft,
    Pencil,
    Check,
    X,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { changeUsername } from "../../../services/adminService";

function AccountSection() {
    const navigate = useNavigate();
    const { admin, refreshAdmin } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ============================================================
    // USERNAME
    // ============================================================

    const [editingUsername, setEditingUsername] = useState(false);
    const [usernameValue, setUsernameValue] = useState("");
    const [usernameSaving, setUsernameSaving] = useState(false);
    const [usernameError, setUsernameError] = useState("");

    const startEditUsername = () => {
        setUsernameValue(admin?.username || "");
        setUsernameError("");
        setEditingUsername(true);
    };

    const cancelEditUsername = () => {
        setEditingUsername(false);
        setUsernameError("");
    };

    const saveUsername = async () => {
        const trimmed = usernameValue.trim().toLowerCase();

        if (trimmed.length < 3 || trimmed.length > 30) {
            setUsernameError(
                "Username must be 3-30 characters."
            );
            return;
        }

        setUsernameSaving(true);
        setUsernameError("");

        try {
            await changeUsername(trimmed);
            await refreshAdmin();
            setEditingUsername(false);
        } catch (error) {
            setUsernameError(
                error?.message ||
                    "Failed to change username."
            );
        } finally {
            setUsernameSaving(false);
        }
    };

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

                <div className="mx-auto max-w-[1000px] px-5 py-8 md:px-10 lg:px-12">

                    {/* =================================================
                        BACK
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/settings"
                            )
                        }
                        className="mb-6 flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
                    >
                        <ChevronLeft size={17} />
                        Back to settings
                    </button>

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
                            duration: 0.4,
                        }}
                    >

                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                            Administration
                        </p>

                        <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                            Account.
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                            View your administrator account
                            information and manage account-level
                            actions.
                        </p>

                    </motion.div>

                    {/* =================================================
                        ACCOUNT INFORMATION
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
                            delay: 0.05,
                        }}
                        className="mt-8 border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                    >

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-purple-500/10 text-purple-400">

                                <UserRound size={22} />

                            </div>

                            <div>

                                <h2 className="text-lg font-semibold">
                                    Account information
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    Information associated with your
                                    administrator account.
                                </p>

                            </div>

                        </div>

                        {/* ACCOUNT DETAILS */}

                        <div className="mt-8 grid gap-5 border-t border-[var(--border)] pt-6 md:grid-cols-2">

                            {/* USERNAME */}

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                                    Username
                                </p>

                                {editingUsername ? (
                                    <div className="mt-2">

                                        <div className="flex items-center gap-2">

                                            <input
                                                type="text"
                                                value={usernameValue}
                                                onChange={(event) =>
                                                    setUsernameValue(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={usernameSaving}
                                                autoFocus
                                                maxLength={30}
                                                className="h-9 flex-1 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-purple-500/50"
                                            />

                                            <button
                                                type="button"
                                                onClick={saveUsername}
                                                disabled={usernameSaving}
                                                aria-label="Save username"
                                                className="flex h-9 w-9 shrink-0 items-center justify-center border border-green-500/30 text-green-400 transition hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {usernameSaving ? (
                                                    <Loader2
                                                        size={15}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <Check size={15} />
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={cancelEditUsername}
                                                disabled={usernameSaving}
                                                aria-label="Cancel"
                                                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--muted)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <X size={15} />
                                            </button>

                                        </div>

                                        {usernameError && (
                                            <p className="mt-2 text-xs text-red-400">
                                                {usernameError}
                                            </p>
                                        )}

                                    </div>
                                ) : (
                                    <div className="mt-2 flex items-center gap-2">

                                        <p className="text-sm font-medium">
                                            {admin?.username || "Not available"}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={startEditUsername}
                                            aria-label="Edit username"
                                            className="text-[var(--muted)] transition hover:text-purple-400"
                                        >
                                            <Pencil size={13} />
                                        </button>

                                    </div>
                                )}

                            </div>

                            {/* EMAIL */}

                            <div>

                                <div className="flex items-center gap-2">

                                    <Mail
                                        size={14}
                                        className="text-[var(--muted)]"
                                    />

                                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                                        Email
                                    </p>

                                </div>

                                <p className="mt-2 text-sm font-medium">
                                    {admin?.email || "Not available"}
                                </p>

                            </div>

                            {/* ROLE */}

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                                    Account role
                                </p>

                                <p className="mt-2 text-sm font-medium">
                                    {admin?.role || "Administrator"}
                                </p>

                            </div>

                            {/* 2FA */}

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                                    Two-factor authentication
                                </p>

                                <div className="mt-2 flex items-center gap-2">

                                    <ShieldCheck
                                        size={16}
                                        className={
                                            admin?.twoFactorEnabled
                                                ? "text-green-400"
                                                : "text-yellow-400"
                                        }
                                    />

                                    <span
                                        className={
                                            admin?.twoFactorEnabled
                                                ? "text-sm font-medium text-green-400"
                                                : "text-sm font-medium text-yellow-400"
                                        }
                                    >
                                        {admin?.twoFactorEnabled
                                            ? "Enabled"
                                            : "Disabled"}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </motion.section>

                    {/* =================================================
                        ACCOUNT STATUS
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
                            delay: 0.1,
                        }}
                        className="mt-6 border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                    >

                        <h2 className="text-lg font-semibold">
                            Account status
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                            Your administrator account is currently
                            active.
                        </p>

                        <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-6">

                            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />

                            <span className="text-sm font-medium text-green-400">
                                Active
                            </span>

                        </div>

                    </motion.section>

                    {/* =================================================
                        DANGER ZONE
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
                            delay: 0.15,
                        }}
                        className="mt-6 border border-red-500/20 bg-red-500/5 p-6 md:p-8"
                    >

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-red-500/10 text-red-400">

                                <Trash2 size={20} />

                            </div>

                            <div>

                                <h2 className="text-lg font-semibold">
                                    Danger zone
                                </h2>

                                <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                    Account deletion is a destructive
                                    action and will permanently remove
                                    your administrator account and its
                                    associated data.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            disabled
                            className="mt-6 border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 opacity-50"
                        >
                            Delete administrator account
                        </button>

                        <p className="mt-3 text-xs text-[var(--muted)]">
                            Account deletion is currently unavailable.
                        </p>

                    </motion.section>

                </div>

            </main>

        </div>
    );
}

export default AccountSection;