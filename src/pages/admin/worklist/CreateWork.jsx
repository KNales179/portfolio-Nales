import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Lock,
    Plus,
    ShieldCheck,
    Unlock,
} from "lucide-react";
import { motion } from "framer-motion";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import { useAuth } from "../../../context/AuthContext";

import { createWork } from "../../../services/workApi";

import {
    canCreateWork,
} from "../../../utils/workPermissions";


// ============================================================
// COMPONENT
// ============================================================

function CreateWork() {
    const navigate = useNavigate();

    const { admin } = useAuth();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    // ========================================================
    // FORM
    // ========================================================

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [accessMode, setAccessMode] =
        useState("COLLABORATIVE");

    const [workPassword, setWorkPassword] =
        useState("");

    // ========================================================
    // STATE
    // ========================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================================
    // ACCESS MODE
    // ========================================================

    const handleAccessModeChange = (
        nextAccessMode
    ) => {
        setAccessMode(
            nextAccessMode
        );

        if (
            nextAccessMode !==
            "PASSWORD_PROTECTED"
        ) {
            setWorkPassword("");
        }

        setError("");
    };


    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        // ----------------------------------------------------
        // FRONTEND PERMISSION CHECK
        // ----------------------------------------------------

        if (!canCreateWork(admin)) {
            setError(
                "You do not have permission to create work."
            );

            return;
        }

        // ----------------------------------------------------
        // NORMALIZE INPUT
        // ----------------------------------------------------

        const trimmedTitle =
            title.trim();

        const trimmedDescription =
            description.trim();

        const trimmedPassword =
            workPassword.trim();


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (!trimmedTitle) {
            setError(
                "Work title is required."
            );

            return;
        }

        if (!trimmedDescription) {
            setError(
                "Work description is required."
            );

            return;
        }

        if (
            accessMode ===
                "PASSWORD_PROTECTED" &&
            !trimmedPassword
        ) {
            setError(
                "A work password is required for password-protected access."
            );

            return;
        }

        if (
            accessMode ===
                "PASSWORD_PROTECTED" &&
            trimmedPassword.length < 8
        ) {
            setError(
                "The work password must contain at least 8 characters."
            );

            return;
        }


        // ----------------------------------------------------
        // PAYLOAD
        // ----------------------------------------------------

        const payload = {
            title:
                trimmedTitle,

            description:
                trimmedDescription,

            accessMode,

            ...(accessMode ===
                "PASSWORD_PROTECTED"
                ? {
                    password:
                        trimmedPassword,
                }
                : {}),
        };


        // ----------------------------------------------------
        // CREATE
        // ----------------------------------------------------

        try {
            setLoading(true);
            setError("");

            const response =
                await createWork(
                    payload
                );

            const createdWork =
                response?.data?.work ||
                response?.work ||
                null;

            const createdWorkId =
                createdWork?._id ||
                createdWork?.id ||
                null;

            if (createdWorkId) {
                navigate(
                    `/portfolio-Nales/admin/worklist/${createdWorkId}`
                );

                return;
            }

            navigate(
                "/portfolio-Nales/admin/worklist"
            );

        } catch (error) {
            console.error(
                "Failed to create work:",
                error
            );

            setError(
                error?.message ||
                "Unable to create work."
            );

        } finally {
            setLoading(false);
        }
    };


    // ========================================================
    // PERMISSION GUARD
    // ========================================================

    if (!canCreateWork(admin)) {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (current) =>
                                !current
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

                    <div className="mx-auto max-w-[900px] px-5 py-12 md:px-10">

                        <div className="border border-red-500/20 bg-red-500/5 p-8">

                            <ShieldCheck
                                size={30}
                                className="text-red-400"
                            />

                            <h1 className="mt-4 text-xl font-semibold">
                                Access denied
                            </h1>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                You do not have permission
                                to create work.
                            </p>

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-[var(--surface)]">

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen(
                        (current) =>
                            !current
                    )
                }
            />


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <AdminSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-10 lg:px-12">

                    {/* ==================================================
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

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/portfolio-Nales/admin/worklist"
                                )
                            }
                            className="mb-6 flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back to work list

                        </button>


                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                            Work System
                        </p>


                        <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                            Create work.
                        </h1>


                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                            Create a shared work container
                            for the administrator team.
                        </p>

                    </motion.div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mt-6 border border-red-500/20 bg-red-500/5 p-5"
                        >

                            <p className="text-sm font-semibold text-red-400">
                                Unable to create work
                            </p>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                {error}
                            </p>

                        </motion.div>
                    )}


                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <motion.form
                        onSubmit={
                            handleSubmit
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
                            delay: 0.05,
                        }}
                        className="mt-8 space-y-6"
                    >

                        {/* ==================================================
                            BASIC INFORMATION
                        ================================================== */}

                        <section className="border border-[var(--border)] bg-[var(--card)]">

                            <div className="border-b border-[var(--border)] p-6">

                                <h2 className="text-lg font-semibold">
                                    Work information
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    Define the basic information
                                    for this work.
                                </p>

                            </div>


                            <div className="space-y-6 p-6">

                                {/* TITLE */}

                                <div>

                                    <label
                                        htmlFor="workTitle"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Work title
                                    </label>

                                    <input
                                        id="workTitle"
                                        type="text"
                                        value={
                                            title
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            setTitle(
                                                event.target.value
                                            );

                                            setError(
                                                ""
                                            );
                                        }}
                                        maxLength={200}
                                        placeholder="e.g. Portfolio authentication system"
                                        disabled={
                                            loading
                                        }
                                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-purple-400 disabled:opacity-60"
                                    />

                                    <p className="mt-2 text-xs text-[var(--muted)]">
                                        {
                                            title.length
                                        }
                                        /200
                                    </p>

                                </div>


                                {/* DESCRIPTION */}

                                <div>

                                    <label
                                        htmlFor="workDescription"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="workDescription"
                                        value={
                                            description
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            setDescription(
                                                event.target.value
                                            );

                                            setError(
                                                ""
                                            );
                                        }}
                                        maxLength={2000}
                                        rows={6}
                                        placeholder="Describe what this work is about and what the team is expected to accomplish."
                                        disabled={
                                            loading
                                        }
                                        className="w-full resize-y border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-400 disabled:opacity-60"
                                    />

                                    <p className="mt-2 text-xs text-[var(--muted)]">
                                        {
                                            description.length
                                        }
                                        /2000
                                    </p>

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            ACCESS
                        ================================================== */}

                        <section className="border border-[var(--border)] bg-[var(--card)]">

                            <div className="border-b border-[var(--border)] p-6">

                                <h2 className="text-lg font-semibold">
                                    Access
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    Decide how administrators
                                    can access this work.
                                </p>

                            </div>


                            <div className="space-y-4 p-6">

                                {/* OPEN VIEW */}

                                <label className="flex cursor-pointer items-start gap-3 border border-[var(--border)] p-4 transition hover:bg-[var(--surface)]">

                                    <input
                                        type="radio"
                                        name="accessMode"
                                        value="OPEN_VIEW"
                                        checked={
                                            accessMode ===
                                            "OPEN_VIEW"
                                        }
                                        onChange={() =>
                                            handleAccessModeChange(
                                                "OPEN_VIEW"
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="mt-1"
                                    />

                                    <div className="min-w-0">

                                        <p className="flex items-center gap-2 text-sm font-semibold">

                                            <Unlock
                                                size={16}
                                                className="text-green-400"
                                            />

                                            Open view

                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                            Administrators can
                                            access the work for
                                            viewing.
                                        </p>

                                    </div>

                                </label>


                                {/* COLLABORATIVE */}

                                <label className="flex cursor-pointer items-start gap-3 border border-[var(--border)] p-4 transition hover:bg-[var(--surface)]">

                                    <input
                                        type="radio"
                                        name="accessMode"
                                        value="COLLABORATIVE"
                                        checked={
                                            accessMode ===
                                            "COLLABORATIVE"
                                        }
                                        onChange={() =>
                                            handleAccessModeChange(
                                                "COLLABORATIVE"
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="mt-1"
                                    />

                                    <div className="min-w-0">

                                        <p className="flex items-center gap-2 text-sm font-semibold">

                                            <ShieldCheck
                                                size={16}
                                                className="text-purple-400"
                                            />

                                            Collaborative

                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                            Authorized
                                            administrators can
                                            actively contribute
                                            according to work
                                            permissions.
                                        </p>

                                    </div>

                                </label>


                                {/* PASSWORD PROTECTED */}

                                <label className="flex cursor-pointer items-start gap-3 border border-[var(--border)] p-4 transition hover:bg-[var(--surface)]">

                                    <input
                                        type="radio"
                                        name="accessMode"
                                        value="PASSWORD_PROTECTED"
                                        checked={
                                            accessMode ===
                                            "PASSWORD_PROTECTED"
                                        }
                                        onChange={() =>
                                            handleAccessModeChange(
                                                "PASSWORD_PROTECTED"
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="mt-1"
                                    />

                                    <div className="min-w-0 flex-1">

                                        <p className="flex items-center gap-2 text-sm font-semibold">

                                            <Lock
                                                size={16}
                                                className="text-yellow-400"
                                            />

                                            Password protected

                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                            Require an additional
                                            password before
                                            protected work access.
                                        </p>


                                        {accessMode ===
                                            "PASSWORD_PROTECTED" && (
                                            <input
                                                type="password"
                                                value={
                                                    workPassword
                                                }
                                                onChange={(
                                                    event
                                                ) => {
                                                    setWorkPassword(
                                                        event.target.value
                                                    );

                                                    setError(
                                                        ""
                                                    );
                                                }}
                                                minLength={
                                                    8
                                                }
                                                maxLength={
                                                    128
                                                }
                                                placeholder="Work password"
                                                disabled={
                                                    loading
                                                }
                                                className="mt-4 w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400"
                                            />
                                        )}

                                    </div>

                                </label>

                            </div>

                        </section>


                        {/* ==================================================
                            OWNERSHIP NOTICE
                        ================================================== */}

                        <div className="border border-purple-500/20 bg-purple-500/5 p-5">

                            <div className="flex items-start gap-3">

                                <ShieldCheck
                                    size={19}
                                    className="mt-0.5 shrink-0 text-purple-400"
                                />

                                <div>

                                    <p className="text-sm font-semibold">
                                        Work ownership
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                        You will automatically
                                        become the creator and
                                        owner of this work.
                                        Participants can be
                                        added after creation
                                        through the work
                                        participant controls.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/portfolio-Nales/admin/worklist"
                                    )
                                }
                                disabled={
                                    loading
                                }
                                className="border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:bg-[var(--card)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !title.trim() ||
                                    !description.trim() ||
                                    (
                                        accessMode ===
                                            "PASSWORD_PROTECTED" &&
                                        (
                                            !workPassword.trim() ||
                                            workPassword.trim().length < 8
                                        )
                                    )
                                }
                                className="flex items-center justify-center gap-2 bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {loading ? (
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Plus
                                        size={17}
                                    />
                                )}

                                Create work

                            </button>

                        </div>

                    </motion.form>

                </div>

            </main>

        </div>
    );
}

export default CreateWork;