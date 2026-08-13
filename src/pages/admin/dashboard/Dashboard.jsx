import { motion } from "framer-motion";
import {
    Award,
    FileBadge,
    FolderKanban,
    Heart,
    Mail,
    Route,
    Wrench,
} from "lucide-react";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { admin } = useAuth();

    const overviewCards = [
        {
            label: "Projects",
            value: "—",
            icon: FolderKanban,
        },
        {
            label: "Skills",
            value: "—",
            icon: Wrench,
        },
        {
            label: "Certificates",
            value: "—",
            icon: FileBadge,
        },
        {
            label: "Awards",
            value: "—",
            icon: Award,
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--surface)]">

            {/* =========================
                ADMIN NAVBAR
            ========================== */}

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen((current) => !current)
                }
            />

            {/* =========================
                ADMIN SIDEBAR
            ========================== */}

            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* =========================
                MAIN CONTENT
            ========================== */}

            <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-12">

                    {/* Header */}

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
                            Dashboard
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                            Welcome back,{" "}
                            <span className="font-medium text-[var(--text)]">
                                {admin?.fullName || "Administrator"}
                            </span>
                            . Manage your portfolio from here.
                        </p>
                    </motion.div>

                    {/* Overview */}

                    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {overviewCards.map((card, index) => {
                            const Icon = card.icon;

                            return (
                                <motion.div
                                    key={card.label}
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
                                            index * 0.06,
                                    }}
                                    className="border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <div className="flex items-start justify-between">

                                        <div>
                                            <p className="text-xs text-[var(--muted)]">
                                                {card.label}
                                            </p>

                                            <p className="mt-2 text-2xl font-bold">
                                                {card.value}
                                            </p>
                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                            <Icon size={19} />
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })}

                    </section>

                    {/* Workspace */}

                    <section className="mt-6 grid gap-6 lg:grid-cols-3">

                        {/* Portfolio workspace */}

                        <div className="border border-[var(--border)] bg-[var(--card)] p-6 lg:col-span-2">

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                    <FolderKanban size={19} />
                                </div>

                                <div>
                                    <h2 className="font-semibold">
                                        Portfolio Management
                                    </h2>

                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        Manage the content displayed on your portfolio.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">

                                <DashboardLink
                                    icon={FolderKanban}
                                    title="Projects"
                                    description="Manage your projects"
                                />

                                <DashboardLink
                                    icon={Wrench}
                                    title="Skills"
                                    description="Manage technologies and tools"
                                />

                                <DashboardLink
                                    icon={Route}
                                    title="Journey"
                                    description="Manage your development journey"
                                />

                                <DashboardLink
                                    icon={FileBadge}
                                    title="Certificates"
                                    description="Manage certifications"
                                />

                            </div>

                        </div>

                        {/* Activity */}

                        <div className="border border-[var(--border)] bg-[var(--card)] p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                    <Mail size={19} />
                                </div>

                                <div>
                                    <h2 className="font-semibold">
                                        Recent Activity
                                    </h2>

                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        Latest changes
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 flex min-h-40 items-center justify-center text-center">

                                <div>
                                    <p className="text-sm text-[var(--muted)]">
                                        No activity yet.
                                    </p>

                                    <p className="mt-1 text-xs text-[var(--muted)]/70">
                                        Activity will appear here.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </section>

                    {/* Coming later */}

                    <section className="mt-6 border border-dashed border-[var(--border)] p-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                <Heart size={18} />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold">
                                    Portfolio Editor
                                </h2>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Inline editing, project management,
                                    skills, journey, certificates,
                                    awards and more will be connected here.
                                </p>
                            </div>

                        </div>

                    </section>

                </div>
            </main>
        </div>
    );
}

function DashboardLink({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="group cursor-pointer border border-[var(--border)] p-4 transition hover:border-purple-500/40 hover:bg-purple-500/5">

            <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition group-hover:bg-purple-500/15">
                    <Icon size={17} />
                </div>

                <div>
                    <p className="text-sm font-medium">
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                        {description}
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Dashboard;