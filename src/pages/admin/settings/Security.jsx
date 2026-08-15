import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    KeyRound,
    LockKeyhole,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck,
} from "lucide-react";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import { useAuth } from "../../../context/AuthContext";
import { resetPasswordWithTwoFactor } from "../../../services/adminService";

function Security() {
    const { admin } = useAuth();

    // ============================================================
    // SIDEBAR
    // ============================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ============================================================
    // AUTH
    // ============================================================

    const [authToken, setAuthToken] = useState("");

    // ============================================================
    // PASSWORD
    // ============================================================

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordTwoFactorCode, setPasswordTwoFactorCode] =
        useState("");

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [resetPasswordLoading, setResetPasswordLoading] =
        useState(false);

    const [passwordError, setPasswordError] = useState("");
    const [passwordMessage, setPasswordMessage] =
        useState("");

    // ============================================================
    // TOKEN
    // ============================================================

    useEffect(() => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token") ||
            "";

        setAuthToken(token);
    }, []);

    // ============================================================
    // CHANGE PASSWORD
    // ============================================================

    const handleResetPassword = async () => {
        setPasswordError("");
        setPasswordMessage("");

        // --------------------------------------------------------
        // TOKEN
        // --------------------------------------------------------

        if (!authToken) {
            setPasswordError(
                "Your administrator session is invalid. Please log in again."
            );

            return;
        }

        // --------------------------------------------------------
        // NEW PASSWORD
        // --------------------------------------------------------

        if (!newPassword) {
            setPasswordError(
                "Enter your new password."
            );

            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(
                "Your new password must contain at least 8 characters."
            );

            return;
        }

        // --------------------------------------------------------
        // CONFIRM PASSWORD
        // --------------------------------------------------------

        if (!confirmPassword) {
            setPasswordError(
                "Confirm your new password."
            );

            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(
                "The passwords do not match."
            );

            return;
        }

        // --------------------------------------------------------
        // AUTHENTICATOR CODE
        // --------------------------------------------------------

        const cleanCode =
            passwordTwoFactorCode.replace(/\D/g, "");

        if (cleanCode.length !== 6) {
            setPasswordError(
                "Enter the current 6-digit authentication code."
            );

            return;
        }

        // --------------------------------------------------------
        // REQUEST
        // --------------------------------------------------------

        try {
            setResetPasswordLoading(true);

            await resetPasswordWithTwoFactor(
                cleanCode,
                newPassword
            );

            // ----------------------------------------------------
            // CLEAR SENSITIVE DATA
            // ----------------------------------------------------

            setNewPassword("");
            setConfirmPassword("");
            setPasswordTwoFactorCode("");
            setShowNewPassword(false);

            setPasswordMessage(
                "Your password has been changed successfully."
            );
        } catch (error) {
            console.error(
                "Password reset failed:",
                error
            );

            setPasswordError(
                error?.message ||
                    "Unable to change your password."
            );
        } finally {
            setResetPasswordLoading(false);
        }
    };

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
                            Security
                        </p>

                        <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                            Security settings.
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                            Manage your administrator
                            password and account security.
                        </p>

                    </motion.div>

                    {/* =================================================
                        CHANGE PASSWORD
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
                            duration: 0.45,
                            delay: 0.05,
                        }}
                        className="mt-8 border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                    >

                        {/* HEADER */}

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">

                                <KeyRound
                                    size={23}
                                />

                            </div>

                            <div>

                                <h2 className="text-lg font-semibold">
                                    Change password
                                </h2>

                                <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
                                    Change your administrator
                                    password using your
                                    authenticator verification.
                                </p>

                            </div>

                        </div>

                        {/* FORM */}

                        <div className="mt-8 grid gap-5 border-t border-[var(--border)] pt-6">

                            {/* NEW PASSWORD */}

                            <div className="max-w-xl">

                                <label
                                    htmlFor="newPassword"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    New password
                                </label>

                                <div className="relative">

                                    <input
                                        id="newPassword"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        value={
                                            newPassword
                                        }
                                        onChange={(event) => {
                                            setNewPassword(
                                                event.target.value
                                            );

                                            setPasswordError(
                                                ""
                                            );

                                            setPasswordMessage(
                                                ""
                                            );
                                        }}
                                        placeholder="Enter your new password"
                                        disabled={
                                            resetPasswordLoading
                                        }
                                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pr-12 text-sm outline-none transition focus:border-purple-400 disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        disabled={
                                            resetPasswordLoading
                                        }
                                        className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-50"
                                    >

                                        {showNewPassword ? (
                                            <EyeOff
                                                size={18}
                                            />
                                        ) : (
                                            <Eye
                                                size={18}
                                            />
                                        )}

                                    </button>

                                </div>

                                <p className="mt-2 text-xs text-[var(--muted)]">
                                    Password must contain
                                    at least 8 characters.
                                </p>

                            </div>

                            {/* CONFIRM PASSWORD */}

                            <div className="max-w-xl">

                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Confirm new password
                                </label>

                                <input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(event) => {
                                        setConfirmPassword(
                                            event.target.value
                                        );

                                        setPasswordError(
                                            ""
                                        );

                                        setPasswordMessage(
                                            ""
                                        );
                                    }}
                                    placeholder="Confirm your new password"
                                    disabled={
                                        resetPasswordLoading
                                    }
                                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-purple-400 disabled:opacity-60"
                                />

                            </div>

                            {/* AUTHENTICATOR CODE */}

                            <div className="max-w-xl">

                                <label
                                    htmlFor="passwordTwoFactorCode"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Authenticator code
                                </label>

                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <input
                                        id="passwordTwoFactorCode"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        value={
                                            passwordTwoFactorCode
                                        }
                                        onChange={(event) => {
                                            setPasswordTwoFactorCode(
                                                event.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            );

                                            setPasswordError(
                                                ""
                                            );

                                            setPasswordMessage(
                                                ""
                                            );
                                        }}
                                        placeholder="000000"
                                        disabled={
                                            resetPasswordLoading
                                        }
                                        className="min-w-0 flex-1 border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center text-xl font-semibold tracking-[0.35em] outline-none focus:border-purple-400 disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleResetPassword
                                        }
                                        disabled={
                                            resetPasswordLoading ||
                                            newPassword.length < 8 ||
                                            confirmPassword.length === 0 ||
                                            passwordTwoFactorCode.length !== 6
                                        }
                                        className="flex shrink-0 items-center justify-center gap-2 bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {resetPasswordLoading ? (
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <LockKeyhole
                                                size={17}
                                            />
                                        )}

                                        Change password

                                    </button>

                                </div>

                            </div>

                        </div>

                        {/* MESSAGE */}

                        <AnimatePresence mode="wait">

                            {passwordMessage && (
                                <motion.p
                                    initial={{
                                        opacity: 0,
                                        y: -5,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}
                                    className="mt-6 text-sm text-green-400"
                                >
                                    {passwordMessage}
                                </motion.p>
                            )}

                            {passwordError && (
                                <motion.p
                                    initial={{
                                        opacity: 0,
                                        y: -5,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}
                                    className="mt-6 text-sm text-red-400"
                                    role="alert"
                                >
                                    {passwordError}
                                </motion.p>
                            )}

                        </AnimatePresence>

                        {/* SECURITY NOTICE */}

                        <div className="mt-6 border border-purple-500/20 bg-purple-500/5 p-4">

                            <div className="flex items-start gap-3">

                                <ShieldCheck
                                    size={18}
                                    className="mt-0.5 shrink-0 text-purple-400"
                                />

                                <div>

                                    <p className="text-sm font-medium">
                                        Additional verification required
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                        Your authenticator
                                        code is required
                                        to change the
                                        administrator
                                        password.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </motion.section>

                </div>

            </main>

        </div>
    );
}

export default Security;