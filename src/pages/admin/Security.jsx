import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    ShieldOff,
    Loader2,
    Copy,
    Check,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";

import { useAuth } from "../../context/AuthContext";

import { getCurrentAdmin } from "../../services/authService";

import {
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
    resetPasswordWithTwoFactor,
} from "../../services/adminService";

function Security() {
    const navigate = useNavigate();

    const { admin, setAdmin } = useAuth();

    // ============================================================
    // SIDEBAR STATE
    // ============================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ============================================================
    // GENERAL UI STATE
    // ============================================================

    const [loading, setLoading] = useState(true);
    const [setupLoading, setSetupLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // ============================================================
    // AUTH TOKEN
    // ============================================================

    const [authToken, setAuthToken] = useState("");

    // ============================================================
    // 2FA STATE
    // ============================================================

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [code, setCode] = useState("");

    // ============================================================
    // 2FA MESSAGE STATE
    // ============================================================

    const [twoFactorError, setTwoFactorError] = useState("");
    const [twoFactorMessage, setTwoFactorMessage] = useState("");
    const [copied, setCopied] = useState(false);

    // ============================================================
    // RESET PASSWORD STATE
    // ============================================================

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [resetPasswordLoading, setResetPasswordLoading] =
        useState(false);

    const [showNewPassword, setShowNewPassword] = useState(false);

    // ============================================================
    // PASSWORD MESSAGE STATE
    // ============================================================

    const [passwordError, setPasswordError] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    // ============================================================
    // GET AUTH TOKEN
    // ============================================================

    const getStoredToken = () => {
        return (
            localStorage.getItem("token") ||
            sessionStorage.getItem("token") ||
            ""
        );
    };

    // ============================================================
    // LOAD SECURITY STATUS
    // ============================================================

    useEffect(() => {
        const token = getStoredToken();

        setAuthToken(token);

        loadSecurityStatus();
    }, []);

    const loadSecurityStatus = async () => {
        try {
            setLoading(true);
            setTwoFactorError("");

            const response = await getCurrentAdmin();

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

            const enabled =
                Boolean(currentAdmin.twoFactorEnabled);

            setTwoFactorEnabled(enabled);

            if (setAdmin) {
                setAdmin(currentAdmin);
            }
        } catch (error) {
            console.error(
                "Failed to load security status:",
                error
            );

            setTwoFactorError(
                error?.message ||
                    "Unable to load security settings."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // START 2FA SETUP
    // ============================================================

    const handleSetup = async () => {
        try {
            setSetupLoading(true);

            setTwoFactorError("");
            setTwoFactorMessage("");

            setPasswordError("");
            setPasswordMessage("");

            const response = await setupTwoFactor();

            const data = response?.data || {};

            const generatedQrCode =
                data.qrCode ||
                data.qrCodeDataUrl ||
                data.qr ||
                "";

            const generatedSecret =
                data.secret ||
                data.manualKey ||
                "";

            if (!generatedQrCode) {
                throw new Error(
                    "The server did not return a QR code."
                );
            }

            setQrCode(generatedQrCode);
            setSecret(generatedSecret);
            setCode("");
        } catch (error) {
            console.error(
                "2FA setup failed:",
                error
            );

            setTwoFactorError(
                error?.message ||
                    "Unable to start two-factor authentication setup."
            );
        } finally {
            setSetupLoading(false);
        }
    };

    // ============================================================
    // ENABLE 2FA
    // ============================================================

    const handleEnable = async () => {
        const cleanCode =
            code.replace(/\D/g, "");

        if (cleanCode.length !== 6) {
            setTwoFactorError(
                "Enter the 6-digit code from your authenticator app."
            );

            return;
        }

        try {
            setActionLoading(true);

            setTwoFactorError("");
            setTwoFactorMessage("");

            const response =
                await enableTwoFactor(cleanCode);

            const updatedAdmin =
                response?.data?.admin ||
                response?.admin ||
                null;

            // ====================================================
            // UPDATE LOCAL AUTH STATE
            // ====================================================

            const authenticatedAdmin = {
                ...(admin || {}),
                ...(updatedAdmin || {}),
                twoFactorEnabled: true,
            };

            setTwoFactorEnabled(true);

            if (setAdmin) {
                setAdmin(authenticatedAdmin);
            }

            // ====================================================
            // CLEAR SETUP DATA
            // ====================================================

            setQrCode("");
            setSecret("");
            setCode("");

            setTwoFactorMessage(
                "Two-factor authentication has been enabled."
            );

            // ====================================================
            // RETURN TO DASHBOARD
            // ====================================================

            navigate(
                "/portfolio-Nales/admin/dashboard",
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(
                "Failed to enable 2FA:",
                error
            );

            setTwoFactorError(
                error?.message ||
                    "Invalid authentication code."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ============================================================
    // DISABLE 2FA
    // ============================================================

    const handleDisable = async () => {
        const cleanCode =
            code.replace(/\D/g, "");

        if (cleanCode.length !== 6) {
            setTwoFactorError(
                "Enter the current 6-digit authentication code."
            );

            return;
        }

        const password = window.prompt(
            "Enter your password to disable two-factor authentication:"
        );

        if (!password) {
            return;
        }

        try {
            setActionLoading(true);

            setTwoFactorError("");
            setTwoFactorMessage("");

            const response =
                await disableTwoFactor(
                    cleanCode,
                    password
                );

            const updatedAdmin =
                response?.data?.admin ||
                response?.admin ||
                null;

            setTwoFactorEnabled(false);

            if (updatedAdmin && setAdmin) {
                setAdmin(updatedAdmin);
            }

            // ====================================================
            // CLEAR 2FA DATA
            // ====================================================

            setCode("");
            setQrCode("");
            setSecret("");

            // ====================================================
            // CLEAR PASSWORD FORM
            // ====================================================

            setNewPassword("");
            setConfirmPassword("");
            setShowNewPassword(false);

            setPasswordError("");
            setPasswordMessage("");

            setTwoFactorMessage(
                "Two-factor authentication has been disabled."
            );
        } catch (error) {
            console.error(
                "Failed to disable 2FA:",
                error
            );

            setTwoFactorError(
                error?.message ||
                    "Unable to disable two-factor authentication."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ============================================================
    // COPY SECRET
    // ============================================================

    const handleCopySecret = async () => {
        if (!secret) {
            return;
        }

        try {
            await navigator.clipboard.writeText(secret);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            setTwoFactorError(
                "Unable to copy the secret key."
            );
        }
    };

    // ============================================================
    // RESET PASSWORD
    // ============================================================

    const handleResetPassword = async () => {
        // ========================================================
        // SECURITY CHECK
        // ========================================================

        if (!authToken) {
            setPasswordError(
                "Your administrator session is invalid. Please log in again."
            );

            return;
        }

        if (!twoFactorEnabled) {
            setPasswordError(
                "Two-factor authentication must be enabled before changing your password."
            );

            return;
        }

        // ========================================================
        // VALIDATE PASSWORD
        // ========================================================

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

        // ========================================================
        // VALIDATE 2FA CODE
        // ========================================================

        const cleanCode =
            code.replace(/\D/g, "");

        if (cleanCode.length !== 6) {
            setPasswordError(
                "Enter the current 6-digit authentication code."
            );

            return;
        }

        try {
            setResetPasswordLoading(true);

            setPasswordError("");
            setPasswordMessage("");

            // ====================================================
            // EXISTING BACKEND SERVICE
            // ====================================================

            await resetPasswordWithTwoFactor(
                cleanCode,
                newPassword
            );

            // ====================================================
            // CLEAR SENSITIVE DATA
            // ====================================================

            setNewPassword("");
            setConfirmPassword("");
            setCode("");
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
    // PASSWORD VISIBILITY CONDITION
    // ============================================================

    /*
        Password management is visible ONLY when:

        1. An authentication token exists
        2. 2FA is enabled
    */

    const canManagePassword =
        Boolean(
            authToken &&
                twoFactorEnabled
        );

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

            {/* =====================================================
                ADMIN NAVBAR
            ====================================================== */}

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen(
                        (current) => !current
                    )
                }
            />

            {/* =====================================================
                ADMIN SIDEBAR
            ====================================================== */}

            <AdminSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

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
                            Manage two-factor authentication
                            and administrator account security.
                        </p>

                    </motion.div>

                    {/* =================================================
                        2FA CARD
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

                        {/* =================================================
                            2FA HEADER
                        ================================================== */}

                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                            <div className="flex items-start gap-4">

                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                        twoFactorEnabled
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-purple-500/10 text-purple-400"
                                    }`}
                                >

                                    {twoFactorEnabled ? (
                                        <ShieldCheck
                                            size={24}
                                        />
                                    ) : (
                                        <ShieldOff
                                            size={24}
                                        />
                                    )}

                                </div>

                                <div>

                                    <h2 className="text-lg font-semibold">
                                        Two-factor authentication
                                    </h2>

                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        {twoFactorEnabled
                                            ? "Your administrator account is protected with two-factor authentication."
                                            : "Add an authenticator app to protect your administrator account."}
                                    </p>

                                </div>

                            </div>

                            <span
                                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                    twoFactorEnabled
                                        ? "bg-green-500/10 text-green-400"
                                        : "bg-yellow-500/10 text-yellow-400"
                                }`}
                            >
                                {twoFactorEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </span>

                        </div>

                        {/* =================================================
                            ENABLED / DISABLE 2FA
                        ================================================== */}

                        {twoFactorEnabled && (
                            <div className="mt-8 border-t border-[var(--border)] pt-6">

                                <h3 className="font-semibold">
                                    Disable two-factor authentication
                                </h3>

                                <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
                                    Disabling 2FA removes the
                                    additional authentication
                                    requirement from your
                                    administrator account.
                                </p>

                                <div className="mt-5 max-w-sm">

                                    <label
                                        htmlFor="disableTwoFactorCode"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Authentication code
                                    </label>

                                    <input
                                        id="disableTwoFactorCode"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        value={code}
                                        onChange={(event) => {
                                            setCode(
                                                event.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            );

                                            setTwoFactorError("");
                                            setPasswordError("");
                                        }}
                                        placeholder="000000"
                                        disabled={actionLoading}
                                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center text-xl font-semibold tracking-[0.4em] outline-none focus:border-purple-400 disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleDisable
                                        }
                                        disabled={
                                            actionLoading ||
                                            code.length !== 6
                                        }
                                        className="mt-4 flex w-full items-center justify-center gap-2 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {actionLoading ? (
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <ShieldOff
                                                size={17}
                                            />
                                        )}

                                        Disable 2FA

                                    </button>

                                </div>

                            </div>
                        )}

                        {/* =================================================
                            DISABLED / SETUP BUTTON
                        ================================================== */}

                        {!twoFactorEnabled &&
                            !qrCode && (
                                <div className="mt-8 border-t border-[var(--border)] pt-6">

                                    <button
                                        type="button"
                                        onClick={
                                            handleSetup
                                        }
                                        disabled={
                                            setupLoading
                                        }
                                        className="flex items-center justify-center gap-2 bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {setupLoading ? (
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <ShieldCheck
                                                size={17}
                                            />
                                        )}

                                        Set up authenticator

                                    </button>

                                </div>
                            )}

                        {/* =================================================
                            QR SETUP
                        ================================================== */}

                        {!twoFactorEnabled &&
                            qrCode && (
                                <div className="mt-8 border-t border-[var(--border)] pt-8">

                                    <h3 className="text-lg font-semibold">
                                        Set up your authenticator
                                    </h3>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                        Scan this QR code
                                        using Google
                                        Authenticator, 2FAS,
                                        Microsoft
                                        Authenticator, or
                                        another compatible
                                        authenticator app.
                                    </p>

                                    {/* QR CODE */}

                                    <div className="mt-6 flex justify-center">

                                        <div className="rounded-xl bg-white p-5 shadow-lg">

                                            <img
                                                src={qrCode}
                                                alt="Two-factor authentication QR code"
                                                className="h-56 w-56"
                                            />

                                        </div>

                                    </div>

                                    {/* MANUAL SECRET */}

                                    {secret && (
                                        <div className="mx-auto mt-6 max-w-lg">

                                            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                                                Manual setup key
                                            </p>

                                            <div className="flex items-center gap-2">

                                                <code className="min-w-0 flex-1 overflow-x-auto border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
                                                    {secret}
                                                </code>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCopySecret
                                                    }
                                                    className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--border)] transition hover:bg-purple-500/10"
                                                    title="Copy setup key"
                                                >

                                                    {copied ? (
                                                        <Check
                                                            size={17}
                                                        />
                                                    ) : (
                                                        <Copy
                                                            size={17}
                                                        />
                                                    )}

                                                </button>

                                            </div>

                                        </div>
                                    )}

                                    {/* VERIFICATION */}

                                    <div className="mx-auto mt-8 max-w-sm">

                                        <label
                                            htmlFor="enableTwoFactorCode"
                                            className="mb-2 block text-sm font-medium"
                                        >
                                            Authentication code
                                        </label>

                                        <input
                                            id="enableTwoFactorCode"
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            value={code}
                                            onChange={(event) => {
                                                setCode(
                                                    event.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                );

                                                setTwoFactorError("");
                                            }}
                                            placeholder="000000"
                                            disabled={
                                                actionLoading
                                            }
                                            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none focus:border-purple-400 disabled:opacity-60"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleEnable
                                            }
                                            disabled={
                                                actionLoading ||
                                                code.length !== 6
                                            }
                                            className="mt-4 flex w-full items-center justify-center gap-2 bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            {actionLoading ? (
                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <ShieldCheck
                                                    size={17}
                                                />
                                            )}

                                            Enable 2FA

                                        </button>

                                    </div>

                                </div>
                            )}

                        {/* =================================================
                            2FA MESSAGES ONLY
                        ================================================== */}

                        {twoFactorMessage && (
                            <p className="mt-6 text-sm text-green-400">
                                {twoFactorMessage}
                            </p>
                        )}

                        {twoFactorError && (
                            <p
                                className="mt-6 text-sm text-red-400"
                                role="alert"
                            >
                                {twoFactorError}
                            </p>
                        )}

                    </motion.section>

                    {/* =================================================
                        PASSWORD SECURITY CARD

                        ONLY VISIBLE WHEN:
                        - TOKEN EXISTS
                        - 2FA IS ENABLED
                    ================================================== */}

                    {canManagePassword && (
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
                                delay: 0.1,
                            }}
                            className="mt-6 border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                        >

                            {/* CARD HEADER */}

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">

                                    <KeyRound
                                        size={23}
                                    />

                                </div>

                                <div>

                                    <h2 className="text-lg font-semibold">
                                        Change Password
                                    </h2>

                                    <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
                                        Change your administrator
                                        password using your
                                        authenticator verification.
                                    </p>

                                </div>

                            </div>

                            {/* PASSWORD FORM */}

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

                                                setPasswordError("");
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
                                            aria-label={
                                                showNewPassword
                                                    ? "Hide new password"
                                                    : "Show new password"
                                            }
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

                                            setPasswordError("");
                                        }}
                                        placeholder="Confirm your new password"
                                        disabled={
                                            resetPasswordLoading
                                        }
                                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-purple-400 disabled:opacity-60"
                                    />

                                </div>

                                {/* 2FA VERIFICATION */}

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
                                            value={code}
                                            onChange={(event) => {
                                                setCode(
                                                    event.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                );

                                                setPasswordError("");
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
                                                code.length !== 6
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

                            {/* PASSWORD MESSAGES */}

                            {passwordMessage && (
                                <p className="mt-6 text-sm text-green-400">
                                    {passwordMessage}
                                </p>
                            )}

                            {passwordError && (
                                <p
                                    className="mt-6 text-sm text-red-400"
                                    role="alert"
                                >
                                    {passwordError}
                                </p>
                            )}

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
                    )}

                </div>

            </main>

        </div>
    );
}

export default Security;
