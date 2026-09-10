import { motion } from "framer-motion";
import {
    ClipboardList,
    Gauge,
    History,
    LayoutDashboard,
    Mail,
    Settings,
    SquarePen,
    UserCircle,
    Users,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";


// ============================================================
// LAYOUT CONSTANTS
// ============================================================

const DEFAULT_WIDTH = 288;
const MIN_WIDTH = 72;
const MAX_WIDTH = 420;
const COLLAPSE_WIDTH = 120;


// ============================================================
// SHARED NAV ITEM
// ============================================================

const navItemClass = (isActive) =>
    `sidebar-nav-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        isActive
            ? "bg-purple-500/15 text-purple-400"
            : "text-[var(--text)]/70 hover:bg-purple-500/10 hover:text-[var(--text)]"
    }`;


function NavItem({ to, end, icon: Icon, label, onClose }) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClose}
            title={label}
        >
            {({ isActive }) => (
                <motion.div
                    whileHover={{ x: 3 }}
                    className={navItemClass(isActive)}
                >
                    <Icon
                        size={18}
                        className={`sidebar-nav-icon shrink-0 ${
                            isActive
                                ? "text-purple-400"
                                : "text-[var(--muted)]"
                        }`}
                    />
                    <span className="sidebar-nav-label truncate">
                        {label}
                    </span>
                </motion.div>
            )}
        </NavLink>
    );
}


const SectionTitle = ({ children }) => (
    <p className="sidebar-section-title mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] first:mt-0">
        {children}
    </p>
);


// ============================================================
// SIDEBAR
// ============================================================

function AdminSidebar({ open, onClose }) {
    const { admin } = useAuth();

    const isSuperAdmin =
        admin?.role === "SUPER_ADMIN";

    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const savedWidth =
            localStorage.getItem(
                "adminSidebarWidth"
            );

        const parsedWidth = savedWidth
            ? Number(savedWidth)
            : DEFAULT_WIDTH;

        return Math.min(
            Math.max(
                parsedWidth,
                MIN_WIDTH
            ),
            MAX_WIDTH
        );
    });

    const isResizing = useRef(false);

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--admin-sidebar-width",
            `${sidebarWidth}px`
        );

        localStorage.setItem(
            "adminSidebarWidth",
            sidebarWidth
        );

        document.documentElement.dataset.sidebarCollapsed =
            sidebarWidth <= COLLAPSE_WIDTH
                ? "true"
                : "false";
    }, [sidebarWidth]);

    const handleResizeStart = (event) => {
        if (window.innerWidth < 1024) {
            return;
        }

        event.preventDefault();

        isResizing.current = true;

        const startX = event.clientX;
        const startWidth = sidebarWidth;

        document.body.style.cursor =
            "col-resize";

        document.body.style.userSelect =
            "none";

        document.documentElement.classList.add(
            "sidebar-resizing"
        );

        const handleMouseMove = (
            moveEvent
        ) => {
            if (!isResizing.current) {
                return;
            }

            const difference =
                moveEvent.clientX -
                startX;

            const newWidth =
                startWidth +
                difference;

            const clampedWidth =
                Math.min(
                    Math.max(
                        newWidth,
                        MIN_WIDTH
                    ),
                    MAX_WIDTH
                );

            document.documentElement.style.setProperty(
                "--admin-sidebar-width",
                `${clampedWidth}px`
            );

            document.documentElement.dataset.sidebarCollapsed =
                clampedWidth <=
                COLLAPSE_WIDTH
                    ? "true"
                    : "false";
        };

        const handleMouseUp = () => {
            if (!isResizing.current) {
                return;
            }

            isResizing.current = false;

            const currentWidth =
                parseInt(
                    getComputedStyle(
                        document.documentElement
                    )
                        .getPropertyValue(
                            "--admin-sidebar-width"
                        )
                        .trim(),
                    10
                );

            const finalWidth =
                Math.min(
                    Math.max(
                        currentWidth ||
                            DEFAULT_WIDTH,
                        MIN_WIDTH
                    ),
                    MAX_WIDTH
                );

            setSidebarWidth(
                finalWidth
            );

            localStorage.setItem(
                "adminSidebarWidth",
                finalWidth
            );

            document.documentElement.dataset.sidebarCollapsed =
                finalWidth <=
                COLLAPSE_WIDTH
                    ? "true"
                    : "false";

            document.documentElement.classList.remove(
                "sidebar-resizing"
            );

            document.body.style.cursor =
                "";

            document.body.style.userSelect =
                "";

            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            document.removeEventListener(
                "mouseup",
                handleMouseUp
            );
        };

        document.addEventListener(
            "mousemove",
            handleMouseMove
        );

        document.addEventListener(
            "mouseup",
            handleMouseUp
        );
    };

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`admin-sidebar fixed left-0 top-20 z-50 h-[calc(100vh-5rem)] border-r border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl lg:translate-x-0 ${
                    open
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
                style={{
                    width:
                        "min(var(--admin-sidebar-width), 85vw)",
                }}
            >
                <div className="flex h-full flex-col">

                    {/* MOBILE HEADER */}

                    <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 lg:hidden">

                        <p className="text-sm font-semibold">
                            Administration
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] transition hover:bg-purple-500/10"
                        >
                            <X size={18} />
                        </button>

                    </div>

                    {/* NAVIGATION */}

                    <nav className="flex-1 overflow-y-auto px-4 py-5">

                        {/* OVERVIEW */}

                        <SectionTitle>Overview</SectionTitle>

                        <div className="space-y-1">
                            <NavItem
                                to="/admin/dashboard"
                                end
                                icon={LayoutDashboard}
                                label="Analytics"
                                onClose={onClose}
                            />
                        </div>

                        {/* PORTFOLIO CONTENT */}

                        <SectionTitle>Portfolio</SectionTitle>

                        <div className="space-y-1">
                            <NavItem
                                to="/admin/edit"
                                icon={SquarePen}
                                label="Edit Portfolio"
                                onClose={onClose}
                            />
                            <NavItem
                                to="/admin/dashboard/messages"
                                icon={Mail}
                                label="Messages"
                                onClose={onClose}
                            />
                        </div>

                        {/* WORK */}

                        <SectionTitle>Work</SectionTitle>

                        <div className="space-y-1">
                            <NavItem
                                to="/admin/worklist"
                                icon={ClipboardList}
                                label="Work List"
                                onClose={onClose}
                            />
                        </div>

                        {/* ACCOUNT */}

                        <SectionTitle>Account</SectionTitle>

                        <div className="space-y-1">
                            <NavItem
                                to="/admin/profile"
                                icon={UserCircle}
                                label="Profile"
                                onClose={onClose}
                            />
                            <NavItem
                                to="/admin/settings"
                                icon={Settings}
                                label="Settings"
                                onClose={onClose}
                            />
                            <NavItem
                                to="/admin/audit-logs"
                                icon={History}
                                label="Audit Logs"
                                onClose={onClose}
                            />
                        </div>

                        {/* SUPER ADMIN */}

                        {isSuperAdmin && (
                            <>
                                <SectionTitle>
                                    Administration
                                </SectionTitle>

                                <div className="space-y-1">
                                    <NavItem
                                        to="/admin/manage-admins"
                                        icon={Users}
                                        label="Manage Admins"
                                        onClose={onClose}
                                    />
                                </div>
                            </>
                        )}

                    </nav>

                    {/* FOOTER */}

                    <div className="sidebar-footer border-t border-[var(--border)] p-4">

                        <div className="sidebar-user-card rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-3">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                                    <Gauge size={18} />
                                </div>

                                <div className="sidebar-user-info min-w-0">

                                    <p className="truncate text-xs font-medium">
                                        {admin?.username ||
                                            "admin"}
                                    </p>

                                    <p className="text-[10px] text-[var(--muted)]">
                                        {admin?.role ||
                                            "ADMIN"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* RESIZE HANDLE */}

                <div
                    onMouseDown={
                        handleResizeStart
                    }
                    className="absolute right-0 top-0 hidden h-full w-1 cursor-col-resize lg:block"
                    title="Drag to resize sidebar"
                />

            </aside>
        </>
    );
}

export default AdminSidebar;
