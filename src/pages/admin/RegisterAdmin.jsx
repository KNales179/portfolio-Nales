import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    Mail,
    Phone,
    ShieldCheck,
    User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { completeFirstLogin } from "../../services/adminService";


// ============================================================
// REGISTER ADMIN  (first login)
// ============================================================
//
// A super admin creates an account with a temporary username +
// password and hands the credentials over. On the new admin's
// first login `ProtectedRoute` sends them here to finish their
// own account before they can use anything else.
// ============================================================

function RegisterAdmin() {
    const navigate = useNavigate();
    const { admin, refreshAdmin } = useAuth();

    const [form, setForm] = useState({
        fullName: admin?.fullName || "",
        username: admin?.username || "",
        email: admin?.email || "",
        phone: admin?.phone || "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const set = (key) => (event) => {
        setForm((current) => ({
            ...current,
            [key]: event.target.value,
        }));
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !form.fullName.trim() ||
            !form.username.trim() ||
            !form.email.trim()
        ) {
            setError(
                "Full name, username and email are required."
            );
            return;
        }

        if (form.newPassword.length < 8) {
            setError(
                "Your password must be at least 8 characters."
            );
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("The passwords do not match.");
            return;
        }

        try {
            setSaving(true);

            await completeFirstLogin({
                username: form.username.trim(),
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                newPassword: form.newPassword,
            });

            await refreshAdmin();

            // ProtectedRoute takes it from here (2FA enrolment).
            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            console.error("First-login setup failed:", err);
            setError(
                err?.message ||
                    "Unable to complete account setup."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full max-w-lg"
            >
                <div className="mb-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                        <ShieldCheck size={25} />
                    </div>

                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                        Finish setup
                    </p>

                    <h1 className="heading-font text-4xl font-bold tracking-tight">
                        Set up your account.
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        Confirm your details and choose a
                        password. You'll set up two-factor
                        authentication next.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        <Field
                            label="Full name"
                            icon={User}
                            className="md:col-span-2"
                        >
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={set("fullName")}
                                disabled={saving}
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                            />
                        </Field>

                        <Field label="Username" icon={User}>
                            <input
                                type="text"
                                value={form.username}
                                onChange={set("username")}
                                autoComplete="username"
                                disabled={saving}
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm lowercase outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                            />
                        </Field>

                        <Field label="Phone" icon={Phone}>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={set("phone")}
                                disabled={saving}
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                            />
                        </Field>

                        <Field
                            label="Email"
                            icon={Mail}
                            className="md:col-span-2"
                        >
                            <input
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                autoComplete="email"
                                disabled={saving}
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                            />
                        </Field>
                    </div>

                    <div className="mt-6 border-t border-[var(--border)] pt-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    New password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            form.newPassword
                                        }
                                        onChange={set(
                                            "newPassword"
                                        )}
                                        autoComplete="new-password"
                                        disabled={saving}
                                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pr-11 text-sm outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (v) => !v
                                            )
                                        }
                                        className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-[var(--muted)] transition hover:text-[var(--text)]"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Confirm password
                                </label>
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        form.confirmPassword
                                    }
                                    onChange={set(
                                        "confirmPassword"
                                    )}
                                    autoComplete="new-password"
                                    disabled={saving}
                                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                                />
                            </div>
                        </div>

                        <p className="mt-2 text-xs text-[var(--muted)]">
                            At least 8 characters.
                        </p>
                    </div>

                    {error && (
                        <p
                            className="mt-5 text-sm text-red-400"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="group mt-6 flex w-full items-center justify-center gap-2 bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                                Saving…
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight
                                    size={17}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </main>
    );
}


function Field({ label, icon: Icon, className = "", children }) {
    return (
        <div className={className}>
            <label className="mb-2 block text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                <Icon
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                {children}
            </div>
        </div>
    );
}

export default RegisterAdmin;
