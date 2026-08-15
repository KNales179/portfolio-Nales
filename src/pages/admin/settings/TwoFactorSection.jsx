import { useState } from "react";
import {
    ShieldCheck,
    ShieldOff,
    Loader2,
    Copy,
    Check,
} from "lucide-react";

import {
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
} from "../../../services/adminService";

function TwoFactorSection({
    enabled,
    admin,
    setAdmin,
    onStatusChange,
}) {
    const [setupLoading, setSetupLoading] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [qrCode, setQrCode] =
        useState("");

    const [secret, setSecret] =
        useState("");

    const [code, setCode] =
        useState("");

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [copied, setCopied] =
        useState(false);

    // ============================================================
    // SETUP
    // ============================================================

    const handleSetup = async () => {
        try {
            setSetupLoading(true);

            setError("");
            setMessage("");

            const response =
                await setupTwoFactor();

            const data =
                response?.data || {};

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

            setQrCode(
                generatedQrCode
            );

            setSecret(
                generatedSecret
            );

            setCode("");
        } catch (error) {
            console.error(
                "2FA setup failed:",
                error
            );

            setError(
                error?.message ||
                    "Unable to start two-factor authentication setup."
            );
        } finally {
            setSetupLoading(false);
        }
    };

    // ============================================================
    // ENABLE
    // ============================================================

    const handleEnable = async () => {
        const cleanCode =
            code.replace(/\D/g, "");

        if (cleanCode.length !== 6) {
            setError(
                "Enter the 6-digit code from your authenticator app."
            );

            return;
        }

        try {
            setActionLoading(true);

            setError("");
            setMessage("");

            const response =
                await enableTwoFactor(
                    cleanCode
                );

            const updatedAdmin =
                response?.data?.admin ||
                response?.admin ||
                null;

            const authenticatedAdmin = {
                ...(admin || {}),
                ...(updatedAdmin || {}),
                twoFactorEnabled: true,
            };

            if (setAdmin) {
                setAdmin(
                    authenticatedAdmin
                );
            }

            setQrCode("");
            setSecret("");
            setCode("");

            setMessage(
                "Two-factor authentication has been enabled."
            );

            if (onStatusChange) {
                onStatusChange(true);
            }
        } catch (error) {
            console.error(
                "Failed to enable 2FA:",
                error
            );

            setError(
                error?.message ||
                    "Invalid authentication code."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ============================================================
    // DISABLE
    // ============================================================

    const handleDisable = async () => {
        const cleanCode =
            code.replace(/\D/g, "");

        if (cleanCode.length !== 6) {
            setError(
                "Enter the current 6-digit authentication code."
            );

            return;
        }

        const password =
            window.prompt(
                "Enter your password to disable two-factor authentication:"
            );

        if (!password) {
            return;
        }

        try {
            setActionLoading(true);

            setError("");
            setMessage("");

            const response =
                await disableTwoFactor(
                    cleanCode,
                    password
                );

            const updatedAdmin =
                response?.data?.admin ||
                response?.admin ||
                null;

            if (
                updatedAdmin &&
                setAdmin
            ) {
                setAdmin(
                    updatedAdmin
                );
            }

            setCode("");
            setQrCode("");
            setSecret("");

            setMessage(
                "Two-factor authentication has been disabled."
            );

            if (onStatusChange) {
                onStatusChange(false);
            }
        } catch (error) {
            console.error(
                "Failed to disable 2FA:",
                error
            );

            setError(
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

    const handleCopySecret =
        async () => {
            if (!secret) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    secret
                );

                setCopied(true);

                setTimeout(() => {
                    setCopied(false);
                }, 1500);
            } catch {
                setError(
                    "Unable to copy the secret key."
                );
            }
        };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <section className="border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">

            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                <div className="flex items-start gap-4">

                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            enabled
                                ? "bg-green-500/10 text-green-400"
                                : "bg-purple-500/10 text-purple-400"
                        }`}
                    >

                        {enabled ? (
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
                            Authenticator protection
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                            {enabled
                                ? "Your administrator account is protected with two-factor authentication."
                                : "Add an authenticator app to protect your administrator account."}
                        </p>

                    </div>

                </div>

                <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        enabled
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                    }`}
                >
                    {enabled
                        ? "Enabled"
                        : "Disabled"}
                </span>

            </div>

            {/* ====================================================
                ENABLED → DISABLE
            ==================================================== */}

            {enabled && (
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

                                setError("");
                            }}
                            placeholder="000000"
                            disabled={
                                actionLoading
                            }
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

            {/* ====================================================
                DISABLED → SETUP
            ==================================================== */}

            {!enabled &&
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

            {/* ====================================================
                QR SETUP
            ==================================================== */}

            {!enabled &&
                qrCode && (
                    <div className="mt-8 border-t border-[var(--border)] pt-8">

                        <h3 className="text-lg font-semibold">
                            Set up your authenticator
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                            Scan this QR code using
                            Google Authenticator,
                            2FAS, Microsoft
                            Authenticator, or another
                            compatible authenticator
                            app.
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

                        {/* SECRET */}

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

                                    setError("");
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

            {/* ====================================================
                MESSAGES
            ==================================================== */}

            {message && (
                <p className="mt-6 text-sm text-green-400">
                    {message}
                </p>
            )}

            {error && (
                <p
                    className="mt-6 text-sm text-red-400"
                    role="alert"
                >
                    {error}
                </p>
            )}

        </section>
    );
}

export default TwoFactorSection;