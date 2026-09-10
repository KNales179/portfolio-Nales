import {
    useCallback,
    useEffect,
    useState,
} from "react";
import { motion } from "framer-motion";
import {
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Lock,
    Pencil,
    Plus,
    ShieldCheck,
    Trash2,
    UserPlus,
    X,
} from "lucide-react";

import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import {
    getAdmins,
    createAdmin,
    updateAdmin,
    updateAdminStatus,
    setAdminPassword,
    deleteAdmin,
    verifyAdminTwoFactor,
    hasValidStepUp,
    clearStepUpToken,
} from "../../services/adminService";


// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "Never";

const isStepUpError = (error) =>
    error?.code === "STEP_UP_REQUIRED";


// ============================================================
// COMPONENT
// ============================================================

function ManageAdmins() {
    const { admin: me } = useAuth();
    const isSuperAdmin = me?.role === "SUPER_ADMIN";

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [unlocked, setUnlocked] = useState(() =>
        hasValidStepUp()
    );

    // Lock screen
    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [lockError, setLockError] = useState("");

    // List
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal: { type: "create" | "edit" | "password" | "delete", admin? }
    const [modal, setModal] = useState(null);


    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getAdmins();
            setAdmins(response.data || []);
        } catch (err) {
            setError(
                err?.message || "Unable to load admins."
            );
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        if (unlocked && isSuperAdmin) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            load();
        }
    }, [unlocked, isSuperAdmin, load]);


    const relock = () => {
        clearStepUpToken();
        setUnlocked(false);
        setModal(null);
    };

    // Wrap a write so an expired step-up token drops back to the
    // lock screen instead of showing a raw error.
    const runGuarded = async (action) => {
        try {
            await action();
            await load();
            return true;
        } catch (err) {
            if (isStepUpError(err)) {
                relock();
                return false;
            }
            throw err;
        }
    };


    const handleVerify = async (event) => {
        event.preventDefault();
        setLockError("");

        const clean = code.replace(/\D/g, "");
        if (clean.length !== 6) {
            setLockError("Enter the 6-digit code.");
            return;
        }

        try {
            setVerifying(true);
            await verifyAdminTwoFactor(clean);
            setCode("");
            setUnlocked(true);
        } catch (err) {
            setLockError(
                err?.message || "Verification failed."
            );
        } finally {
            setVerifying(false);
        }
    };


    // ========================================================
    // SHELL
    // ========================================================

    const shell = (content) => (
        <div className="work-shell min-h-screen">
            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen((v) => !v)
                }
            />
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">
                <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-10 lg:px-12">
                    {content}
                </div>
            </main>
        </div>
    );


    // ========================================================
    // NOT SUPER ADMIN
    // ========================================================

    if (!isSuperAdmin) {
        return shell(
            <div className="mx-auto max-w-[560px] py-16 text-center">
                <Lock
                    size={30}
                    className="mx-auto text-[var(--muted)]"
                />
                <h1 className="mt-4 text-lg font-semibold">
                    Restricted
                </h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                    Only a super admin can manage administrator
                    accounts.
                </p>
            </div>
        );
    }


    // ========================================================
    // LOCK SCREEN
    // ========================================================

    if (!unlocked) {
        return shell(
            <div className="mx-auto max-w-[440px] py-12">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <ShieldCheck size={24} />
                </div>

                <h1 className="heading-font text-3xl font-bold tracking-tight">
                    Verify to continue.
                </h1>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Admin management is locked. Enter the current
                    6-digit code from your authenticator app.
                </p>

                <form
                    onSubmit={handleVerify}
                    className="mt-8 border border-[var(--border)] bg-[var(--card)] p-6"
                >
                    <label
                        htmlFor="stepUpCode"
                        className="mb-2 block text-sm font-medium"
                    >
                        Authenticator code
                    </label>
                    <input
                        id="stepUpCode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        autoFocus
                        value={code}
                        onChange={(event) => {
                            setCode(
                                event.target.value.replace(
                                    /\D/g,
                                    ""
                                )
                            );
                            setLockError("");
                        }}
                        placeholder="000000"
                        disabled={verifying}
                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center text-2xl font-semibold tracking-[0.4em] outline-none focus:border-purple-400 disabled:opacity-60"
                    />

                    {lockError && (
                        <p className="mt-3 text-sm text-red-400">
                            {lockError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={
                            verifying || code.length !== 6
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {verifying ? (
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />
                        ) : (
                            <Lock size={15} />
                        )}
                        Unlock
                    </button>
                </form>
            </div>
        );
    }


    // ========================================================
    // MAIN
    // ========================================================

    return shell(
        <>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
            >
                <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                        Administration
                    </p>
                    <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                        Manage Admins.
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        Create, edit, and remove administrator
                        accounts.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setModal({ type: "create" })}
                    className="flex items-center justify-center gap-2 bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                    <Plus size={16} />
                    New admin
                </button>
            </motion.div>

            {error && (
                <div className="mt-6 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                    {error}
                </div>
            )}

            <div className="work-panel mt-6 overflow-x-auto border border-[var(--border)] bg-[var(--card)]">
                <table className="w-full min-w-[720px] text-sm">
                    <thead>
                        <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-[var(--muted)]">
                            <th className="px-5 py-3 font-semibold">
                                Admin
                            </th>
                            <th className="px-5 py-3 font-semibold">
                                Role
                            </th>
                            <th className="px-5 py-3 font-semibold">
                                Status
                            </th>
                            <th className="px-5 py-3 font-semibold">
                                2FA
                            </th>
                            <th className="px-5 py-3 font-semibold">
                                Last login
                            </th>
                            <th className="px-5 py-3 text-right font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 3 }).map(
                                (_, index) => (
                                    <tr key={index}>
                                        <td
                                            className="px-5 py-4"
                                            colSpan={6}
                                        >
                                            <div className="skeleton h-5 w-full" />
                                        </td>
                                    </tr>
                                )
                            )
                        ) : admins.length === 0 ? (
                            <tr>
                                <td
                                    className="px-5 py-10 text-center text-[var(--muted)]"
                                    colSpan={6}
                                >
                                    No admin accounts.
                                </td>
                            </tr>
                        ) : (
                            admins.map((entry) => {
                                const isSelf =
                                    entry._id === me?._id ||
                                    entry._id === me?.id;

                                return (
                                    <tr
                                        key={entry._id}
                                        className="border-b border-[var(--border)] last:border-b-0"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="font-medium">
                                                {entry.fullName}
                                                {isSelf && (
                                                    <span className="ml-2 text-xs text-[var(--muted)]">
                                                        (you)
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-0.5 text-xs text-[var(--muted)]">
                                                @{entry.username}
                                                {entry.email
                                                    ? ` · ${entry.email}`
                                                    : ""}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                                                {entry.role ===
                                                "SUPER_ADMIN"
                                                    ? "Super admin"
                                                    : "Admin"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    entry.status ===
                                                    "ACTIVE"
                                                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
                                                }`}
                                            >
                                                {entry.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="text-xs text-[var(--muted)]">
                                                {entry.twoFactorEnabled
                                                    ? "Enabled"
                                                    : entry.mustChangePassword
                                                    ? "Pending setup"
                                                    : "Off"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-xs text-[var(--muted)]">
                                            {formatDate(
                                                entry.lastLogin
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <IconAction
                                                    title="Edit"
                                                    onClick={() =>
                                                        setModal(
                                                            {
                                                                type: "edit",
                                                                admin: entry,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Pencil
                                                        size={
                                                            14
                                                        }
                                                    />
                                                </IconAction>

                                                <IconAction
                                                    title="Reset password"
                                                    onClick={() =>
                                                        setModal(
                                                            {
                                                                type: "password",
                                                                admin: entry,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <KeyRound
                                                        size={
                                                            14
                                                        }
                                                    />
                                                </IconAction>

                                                {!isSelf && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                runGuarded(
                                                                    () =>
                                                                        updateAdminStatus(
                                                                            entry._id,
                                                                            entry.status ===
                                                                                "ACTIVE"
                                                                                ? "INACTIVE"
                                                                                : "ACTIVE"
                                                                        )
                                                                ).catch(
                                                                    (
                                                                        err
                                                                    ) =>
                                                                        setError(
                                                                            err?.message ||
                                                                                "Action failed."
                                                                        )
                                                                )
                                                            }
                                                            className="border border-[var(--border)] px-2 py-1 text-[11px] font-semibold transition hover:bg-[var(--surface)]"
                                                        >
                                                            {entry.status ===
                                                            "ACTIVE"
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>

                                                        <IconAction
                                                            title="Delete"
                                                            danger
                                                            onClick={() =>
                                                                setModal(
                                                                    {
                                                                        type: "delete",
                                                                        admin: entry,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <Trash2
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </IconAction>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <ShieldCheck size={13} />
                This area re-locks when your verification
                expires.
            </p>

            {modal?.type === "create" && (
                <CreateAdminModal
                    onClose={() => setModal(null)}
                    onDone={load}
                    runGuarded={runGuarded}
                />
            )}

            {modal?.type === "edit" && (
                <EditAdminModal
                    admin={modal.admin}
                    onClose={() => setModal(null)}
                    runGuarded={runGuarded}
                />
            )}

            {modal?.type === "password" && (
                <PasswordModal
                    admin={modal.admin}
                    onClose={() => setModal(null)}
                    runGuarded={runGuarded}
                />
            )}

            {modal?.type === "delete" && (
                <DeleteModal
                    admin={modal.admin}
                    onClose={() => setModal(null)}
                    runGuarded={runGuarded}
                />
            )}
        </>
    );
}


// ============================================================
// SMALL PIECES
// ============================================================

function IconAction({ title, danger, onClick, children }) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            onClick={onClick}
            className={`flex h-7 w-7 items-center justify-center border transition ${
                danger
                    ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                    : "border-[var(--border)] hover:bg-[var(--surface)]"
            }`}
        >
            {children}
        </button>
    );
}


function Modal({ title, icon: Icon, onClose, children }) {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md border border-[var(--border)] bg-[var(--card)] p-6"
            >
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {Icon && (
                            <Icon
                                size={18}
                                className="text-purple-400"
                            />
                        )}
                        <h2 className="text-lg font-semibold">
                            {title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[var(--muted)] hover:text-[var(--text)]"
                    >
                        <X size={16} />
                    </button>
                </div>

                {children}
            </motion.div>
        </div>
    );
}


function TextField({ label, value, onChange, ...rest }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium">
                {label}
            </label>
            <input
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 disabled:opacity-60"
                {...rest}
            />
        </div>
    );
}


function PasswordPair({
    password,
    confirm,
    onPassword,
    onConfirm,
    disabled,
}) {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-4">
            <div>
                <label className="mb-1.5 block text-sm font-medium">
                    Password
                </label>
                <div className="relative">
                    <input
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                            onPassword(event.target.value)
                        }
                        autoComplete="new-password"
                        disabled={disabled}
                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-purple-400 disabled:opacity-60"
                    />
                    <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-[var(--muted)] hover:text-[var(--text)]"
                        aria-label={
                            show
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {show ? (
                            <EyeOff size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium">
                    Confirm password
                </label>
                <input
                    type={show ? "text" : "password"}
                    value={confirm}
                    onChange={(event) =>
                        onConfirm(event.target.value)
                    }
                    autoComplete="new-password"
                    disabled={disabled}
                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none transition focus:border-purple-400 disabled:opacity-60"
                />
            </div>

            <p className="text-xs text-[var(--muted)]">
                At least 8 characters.
            </p>
        </div>
    );
}


function ModalError({ children }) {
    if (!children) {
        return null;
    }
    return (
        <p className="mt-4 text-sm text-red-400" role="alert">
            {children}
        </p>
    );
}


function SubmitRow({ busy, label, onClose }) {
    return (
        <div className="mt-6 flex justify-end gap-2">
            <button
                type="button"
                onClick={onClose}
                className="border border-[var(--border)] px-4 py-2 text-sm transition hover:bg-[var(--surface)]"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={busy}
                className="flex items-center gap-2 bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
                {busy && (
                    <Loader2
                        size={14}
                        className="animate-spin"
                    />
                )}
                {label}
            </button>
        </div>
    );
}


// ============================================================
// MODALS
// ============================================================

function CreateAdminModal({ onClose, runGuarded }) {
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        temporaryPassword: "",
        confirm: "",
    });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [created, setCreated] = useState(null);

    const set = (key) => (value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
        setError("");
    };

    const submit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !form.fullName.trim() ||
            !form.username.trim()
        ) {
            setError("Full name and username are required.");
            return;
        }
        if (form.temporaryPassword.length < 8) {
            setError(
                "Temporary password must be at least 8 characters."
            );
            return;
        }
        if (form.temporaryPassword !== form.confirm) {
            setError("The passwords do not match.");
            return;
        }

        setBusy(true);
        try {
            const done = await runGuarded(async () => {
                await createAdmin({
                    fullName: form.fullName.trim(),
                    username: form.username.trim(),
                    email: form.email.trim() || undefined,
                    temporaryPassword: form.temporaryPassword,
                });
            });

            if (done) {
                setCreated({
                    username: form.username
                        .trim()
                        .toLowerCase(),
                    temporaryPassword: form.temporaryPassword,
                });
            }
        } catch (err) {
            setError(err?.message || "Could not create admin.");
        } finally {
            setBusy(false);
        }
    };

    if (created) {
        return (
            <Modal
                title="Admin created"
                icon={UserPlus}
                onClose={onClose}
            >
                <p className="text-sm text-[var(--muted)]">
                    Share these one-time credentials with the
                    new admin. They'll set their own details and
                    password on first login.
                </p>
                <div className="mt-4 space-y-2 border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-[var(--muted)]">
                            Username
                        </span>
                        <span className="font-mono font-semibold">
                            {created.username}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-[var(--muted)]">
                            Temp password
                        </span>
                        <span className="font-mono font-semibold">
                            {created.temporaryPassword}
                        </span>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                        Done
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title="New admin"
            icon={UserPlus}
            onClose={onClose}
        >
            <form onSubmit={submit} className="space-y-4">
                <TextField
                    label="Full name"
                    value={form.fullName}
                    onChange={set("fullName")}
                    disabled={busy}
                />
                <TextField
                    label="Username"
                    value={form.username}
                    onChange={set("username")}
                    disabled={busy}
                />
                <TextField
                    label="Email (optional)"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    disabled={busy}
                />
                <PasswordPair
                    password={form.temporaryPassword}
                    confirm={form.confirm}
                    onPassword={set("temporaryPassword")}
                    onConfirm={set("confirm")}
                    disabled={busy}
                />

                <ModalError>{error}</ModalError>
                <SubmitRow
                    busy={busy}
                    label="Create admin"
                    onClose={onClose}
                />
            </form>
        </Modal>
    );
}


function EditAdminModal({ admin, onClose, runGuarded }) {
    const [form, setForm] = useState({
        fullName: admin.fullName || "",
        username: admin.username || "",
        email: admin.email || "",
        phone: admin.phone || "",
    });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const set = (key) => (value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
        setError("");
    };

    const submit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !form.fullName.trim() ||
            !form.username.trim()
        ) {
            setError("Full name and username are required.");
            return;
        }

        setBusy(true);
        try {
            const done = await runGuarded(async () => {
                await updateAdmin(admin._id, {
                    fullName: form.fullName.trim(),
                    username: form.username.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                });
            });
            if (done) {
                onClose();
            }
        } catch (err) {
            setError(err?.message || "Could not save changes.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            title={`Edit @${admin.username}`}
            icon={Pencil}
            onClose={onClose}
        >
            <form onSubmit={submit} className="space-y-4">
                <TextField
                    label="Full name"
                    value={form.fullName}
                    onChange={set("fullName")}
                    disabled={busy}
                />
                <TextField
                    label="Username"
                    value={form.username}
                    onChange={set("username")}
                    disabled={busy}
                />
                <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    disabled={busy}
                />
                <TextField
                    label="Phone"
                    value={form.phone}
                    onChange={set("phone")}
                    disabled={busy}
                />

                <ModalError>{error}</ModalError>
                <SubmitRow
                    busy={busy}
                    label="Save changes"
                    onClose={onClose}
                />
            </form>
        </Modal>
    );
}


function PasswordModal({ admin, onClose, runGuarded }) {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setError("");

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }
        if (password !== confirm) {
            setError("The passwords do not match.");
            return;
        }

        setBusy(true);
        try {
            const ok = await runGuarded(async () => {
                await setAdminPassword(admin._id, password);
            });
            if (ok) {
                setDone(true);
            }
        } catch (err) {
            setError(
                err?.message || "Could not set the password."
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            title={`Reset password — @${admin.username}`}
            icon={KeyRound}
            onClose={onClose}
        >
            {done ? (
                <>
                    <p className="text-sm text-[var(--muted)]">
                        Password set. This admin's sessions were
                        signed out and they must choose their own
                        password on next login.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                        >
                            Done
                        </button>
                    </div>
                </>
            ) : (
                <form onSubmit={submit}>
                    <PasswordPair
                        password={password}
                        confirm={confirm}
                        onPassword={setPassword}
                        onConfirm={setConfirm}
                        disabled={busy}
                    />
                    <ModalError>{error}</ModalError>
                    <SubmitRow
                        busy={busy}
                        label="Set password"
                        onClose={onClose}
                    />
                </form>
            )}
        </Modal>
    );
}


function DeleteModal({ admin, onClose, runGuarded }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const confirmDelete = async () => {
        setError("");
        setBusy(true);
        try {
            const ok = await runGuarded(async () => {
                await deleteAdmin(admin._id);
            });
            if (ok) {
                onClose();
            }
        } catch (err) {
            setError(err?.message || "Could not delete.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            title="Delete admin"
            icon={Trash2}
            onClose={onClose}
        >
            <p className="text-sm leading-6 text-[var(--muted)]">
                Permanently delete{" "}
                <span className="font-semibold text-[var(--text)]">
                    {admin.fullName}
                </span>{" "}
                (@{admin.username})? This can't be undone.
            </p>

            <ModalError>{error}</ModalError>

            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="border border-[var(--border)] px-4 py-2 text-sm transition hover:bg-[var(--surface)]"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={busy}
                    className="flex items-center gap-2 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                    {busy && (
                        <Loader2
                            size={14}
                            className="animate-spin"
                        />
                    )}
                    Delete
                </button>
            </div>
        </Modal>
    );
}


export default ManageAdmins;
