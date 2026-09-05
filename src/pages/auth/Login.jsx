import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    LockKeyhole,
    ShieldCheck,
    User,
    Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    verifyLoginTwoFactor,
} from "../../services/authService";

function Login() {
    const navigate = useNavigate();

    const { admin, login } = useAuth();

    useEffect(() => {
        if (!admin) {
            return;
        }

        if (admin.mustChangePassword) {
            navigate("/admin/profile", {
                replace: true,
                state: {
                    firstLogin: true,
                },
            });

            return;
        }

        if (!admin.twoFactorEnabled) {
            navigate("/admin/security", {
                replace: true,
            });

            return;
        }

        navigate("/admin/dashboard", {
            replace: true,
        });
    }, [admin, navigate]);

    // ============================================================
    // LOGIN FORM
    // ============================================================

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // ============================================================
    // 2FA
    // ============================================================

    const [twoFactorMode, setTwoFactorMode] =
        useState(false);

    const [twoFactorCode, setTwoFactorCode] =
        useState("");

    const [challengeToken, setChallengeToken] =
        useState("");

    // ============================================================
    // UI STATE
    // ============================================================

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ============================================================
    // REDIRECT AFTER AUTHENTICATION
    // ============================================================

    const redirectAfterLogin = (admin) => {
        if (!admin.twoFactorEnabled) {
            navigate(
                "/admin/security",
                {
                    replace: true,
                }
            );

            return;
        }

        navigate(
            "/admin/dashboard",
            {
                replace: true,
            }
        );
    };

    // ============================================================
    // NORMAL LOGIN
    // ============================================================

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError(
                "Please enter your username and password."
            );

            return;
        }

        try {
            setLoading(true);

            const response = await login(
                username.trim(),
                password
            );

            // ====================================================
            // 2FA REQUIRED
            // ====================================================

            const requiresTwoFactor =
                response.requiresTwoFactor ||
                response.data?.requiresTwoFactor;

            if (requiresTwoFactor) {
                const temporaryToken =
                    response.data?.challengeToken;

                if (!temporaryToken) {
                    throw new Error(
                        "Unable to start two-factor authentication."
                    );
                }

                setChallengeToken(
                    temporaryToken
                );

                setTwoFactorMode(true);
                setTwoFactorCode("");

                return;
            }

            // ====================================================
            // NORMAL LOGIN RESPONSE
            // ====================================================

            const admin =
                response.data?.admin ||
                response.admin;

            if (!admin) {
                throw new Error(
                    "Unable to retrieve administrator information."
                );
            }

            // ====================================================
            // FIRST LOGIN
            // ====================================================

            if (admin.mustChangePassword) {
                navigate(
                    "/admin/profile",
                    {
                        replace: true,
                        state: {
                            firstLogin: true,
                        },
                    }
                );

                return;
            }

            // ====================================================
            // 2FA / DASHBOARD
            // ====================================================

            redirectAfterLogin(admin);

        } catch (error) {
            console.error(
                "Login failed:",
                error
            );

            setError(
                error.message ||
                "Unable to sign in. Please check your username and password."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // VERIFY 2FA
    // ============================================================

    const handleTwoFactorSubmit =
        async (event) => {
            event.preventDefault();

            setError("");

            const cleanCode =
                twoFactorCode.replace(
                    /\D/g,
                    ""
                );

            if (cleanCode.length !== 6) {
                setError(
                    "Please enter the 6-digit authentication code."
                );

                return;
            }

            if (!challengeToken) {
                setError(
                    "Your login session has expired. Please sign in again."
                );

                setTwoFactorMode(false);
                setChallengeToken("");

                return;
            }

            try {
                setLoading(true);

                const response =
                    await verifyLoginTwoFactor(
                        challengeToken,
                        cleanCode
                    );

                const admin =
                    response.data?.admin ||
                    response.admin;

                if (!admin) {
                    throw new Error(
                        "Unable to retrieve administrator information."
                    );
                }

                // =================================================
                // FIRST LOGIN
                // =================================================

                if (admin.mustChangePassword) {
                    navigate(
                        "/admin/profile",
                        {
                            replace: true,
                            state: {
                                firstLogin: true,
                            },
                        }
                    );

                    return;
                }

                // =================================================
                // 2FA COMPLETE
                // =================================================

                navigate(
                    "/admin/dashboard",
                    {
                        replace: true,
                    }
                );

            } catch (error) {
                console.error(
                    "2FA verification failed:",
                    error
                );

                setError(
                    error.message ||
                    "Invalid authentication code."
                );

                setTwoFactorCode("");

            } finally {
                setLoading(false);
            }
        };

    // ============================================================
    // RETURN TO LOGIN
    // ============================================================

    const handleBackToLogin = () => {
        if (loading) {
            return;
        }

        setTwoFactorMode(false);
        setTwoFactorCode("");
        setChallengeToken("");
        setError("");
    };

    // ============================================================
    // 2FA SCREEN
    // ============================================================

    if (twoFactorMode) {
        return (
            <main className="flex min-h-screen items-center justify-center px-6 py-20">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                        ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                        ],
                    }}
                    className="w-full max-w-md"
                >

                    {/* HEADER */}

                    <div className="mb-8">

                        <button
                            type="button"
                            onClick={
                                handleBackToLogin
                            }
                            disabled={loading}
                            className="mb-6 flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ArrowLeft size={16} />

                            Back to login
                        </button>

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                            <ShieldCheck size={25} />
                        </div>

                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                            Security
                        </p>

                        <h1 className="heading-font text-4xl font-bold tracking-tight">
                            Two-factor authentication.
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            Enter the 6-digit code from your authenticator app to continue.
                        </p>

                    </div>

                    {/* 2FA FORM */}

                    <form
                        onSubmit={
                            handleTwoFactorSubmit
                        }
                        className="border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                    >

                        <label
                            htmlFor="twoFactorCode"
                            className="mb-2 block text-sm font-medium"
                        >
                            Authentication Code
                        </label>

                        <input
                            id="twoFactorCode"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={twoFactorCode}
                            onChange={(event) => {
                                const value =
                                    event.target.value.replace(
                                        /\D/g,
                                        ""
                                    );

                                setTwoFactorCode(
                                    value
                                );

                                setError("");
                            }}
                            placeholder="000000"
                            disabled={loading}
                            autoFocus
                            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none transition focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        {error && (
                            <motion.p
                                initial={{
                                    opacity: 0,
                                    y: -5,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                className="mt-4 text-sm text-red-400"
                                role="alert"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                twoFactorCode.length !== 6
                            }
                            className="group mt-6 flex w-full items-center justify-center gap-2 bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify Code

                                    <ArrowRight
                                        size={17}
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </>
                            )}
                        </button>

                    </form>

                    <p className="mt-5 text-center text-xs text-[var(--muted)]">
                        Open your authenticator app and enter the current code.
                    </p>

                </motion.div>

            </main>
        );
    }

    // ============================================================
    // NORMAL LOGIN SCREEN
    // ============================================================

    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-20">

            <motion.div
                initial={{
                    opacity: 0,
                    y: 25,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.6,
                    ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                    ],
                }}
                className="w-full max-w-md"
            >

                {/* HEADER */}

                <div className="mb-8">

                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                        Administration
                    </p>

                    <h1 className="heading-font text-4xl font-bold tracking-tight">
                        Welcome back.
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        Sign in to manage your portfolio.
                    </p>

                </div>

                {/* LOGIN FORM */}

                <form
                    onSubmit={handleLogin}
                    className="border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                >

                    {/* USERNAME */}

                    <div>

                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium"
                        >
                            Username
                        </label>

                        <div className="relative">

                            <User
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                            />

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) => {
                                    setUsername(
                                        event.target.value
                                    );

                                    setError("");
                                }}
                                placeholder="Enter username"
                                autoComplete="username"
                                disabled={loading}
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>

                    </div>

                    {/* PASSWORD */}

                    <div className="mt-5">

                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <div className="relative">

                            <LockKeyhole
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                            />

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(
                                        event.target.value
                                    );

                                    setError("");
                                }}
                                placeholder="Enter password"
                                autoComplete="current-password"
                                disabled={loading}
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <motion.p
                            initial={{
                                opacity: 0,
                                y: -5,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mt-4 text-sm text-red-400"
                            role="alert"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group mt-6 flex w-full items-center justify-center gap-2 bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {loading ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />

                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In

                                <ArrowRight
                                    size={17}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </>
                        )}

                    </button>

                </form>

                {/* FOOTER */}

                <p className="mt-5 text-center text-xs text-[var(--muted)]">
                    Authorized administrators only.
                </p>

            </motion.div>

        </main>
    );
}

export default Login;