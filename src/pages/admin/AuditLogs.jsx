import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
} from "lucide-react";

import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import {
    fetchAuditLogs,
    AUDIT_ACTIONS,
    AUDIT_RESOURCES,
} from "../../services/auditApi";


// ============================================================
// HELPERS
// ============================================================

const PAGE_SIZE = 25;

const RESOURCE_LABEL = Object.fromEntries(
    AUDIT_RESOURCES.map((r) => [r.value, r.label])
);

const formatDateTime = (value) => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const actionStyle = (action) => {
    if (action === "CREATE") {
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    }
    if (action === "DELETE") {
        return "border-red-500/30 bg-red-500/10 text-red-400";
    }
    return "border-purple-500/30 bg-purple-500/10 text-purple-400";
};

const actionVerb = (action) => {
    if (action === "CREATE") return "Created";
    if (action === "DELETE") return "Archived";
    return "Updated";
};


// ============================================================
// COMPONENT
// ============================================================

function AuditLogs() {
    const { admin } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [filters, setFilters] = useState({
        resource: "",
        action: "",
        adminId: "",
        q: "",
        scope: "content",
    });
    const [searchDraft, setSearchDraft] = useState("");
    const [page, setPage] = useState(1);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(() => new Set());

    // Both roles see content history; only a super admin can
    // widen to auth / admin / work events.
    const canSeeAll = admin?.role === "SUPER_ADMIN";


    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await fetchAuditLogs({
                ...filters,
                scope: canSeeAll ? filters.scope : "content",
                page,
                limit: PAGE_SIZE,
            });
            setData(result);
        } catch (err) {
            setError(
                err?.message || "Unable to load audit logs."
            );
        } finally {
            setLoading(false);
        }
    }, [filters, page, canSeeAll]);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, [load]);


    const setFilter = (key, value) => {
        setPage(1);
        setExpanded(new Set());
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const submitSearch = (event) => {
        event.preventDefault();
        setFilter("q", searchDraft.trim());
    };

    const toggleExpanded = (id) => {
        setExpanded((current) => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const logs = useMemo(() => data?.logs || [], [data]);
    const pages = data?.pages || 1;
    const total = data?.total || 0;
    const admins = useMemo(() => data?.admins || [], [data]);


    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    return (
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
                <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-10 lg:px-12">

                    {/* HEADER */}

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
                                Audit Logs.
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                Every change to the portfolio's
                                content — who made it, what
                                changed, and when.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={load}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 border border-[var(--border)] px-3 py-2 text-sm transition hover:bg-[var(--card)] disabled:opacity-50"
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    loading ? "animate-spin" : ""
                                }
                            />
                            Refresh
                        </button>
                    </motion.div>


                    {/* FILTERS */}

                    <div className="mt-8 flex flex-wrap items-center gap-2">
                        {canSeeAll && (
                            <div className="flex border border-[var(--border)]">
                                {[
                                    { value: "content", label: "Content" },
                                    { value: "all", label: "All activity" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            setFilter(
                                                "scope",
                                                option.value
                                            )
                                        }
                                        className={`px-3 py-2 text-sm font-semibold transition ${
                                            filters.scope ===
                                            option.value
                                                ? "bg-purple-500 text-white"
                                                : "hover:bg-[var(--card)]"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <select
                            value={filters.resource}
                            onChange={(event) =>
                                setFilter(
                                    "resource",
                                    event.target.value
                                )
                            }
                            className="border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                        >
                            <option value="">
                                All sections
                            </option>
                            {AUDIT_RESOURCES.map((resource) => (
                                <option
                                    key={resource.value}
                                    value={resource.value}
                                >
                                    {resource.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.action}
                            onChange={(event) =>
                                setFilter(
                                    "action",
                                    event.target.value
                                )
                            }
                            className="border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                        >
                            <option value="">
                                All actions
                            </option>
                            {AUDIT_ACTIONS.map((action) => (
                                <option
                                    key={action}
                                    value={action}
                                >
                                    {actionVerb(action)}
                                </option>
                            ))}
                        </select>

                        {admins.length > 0 && (
                            <select
                                value={filters.adminId}
                                onChange={(event) =>
                                    setFilter(
                                        "adminId",
                                        event.target.value
                                    )
                                }
                                className="border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                            >
                                <option value="">
                                    Anyone
                                </option>
                                {admins.map((entry) => (
                                    <option
                                        key={entry.id}
                                        value={entry.id}
                                    >
                                        {entry.fullName ||
                                            entry.username}
                                    </option>
                                ))}
                            </select>
                        )}

                        <form
                            onSubmit={submitSearch}
                            className="flex items-center border border-[var(--border)] bg-[var(--card)] px-2"
                        >
                            <Search
                                size={14}
                                className="text-[var(--muted)]"
                            />
                            <input
                                value={searchDraft}
                                onChange={(event) =>
                                    setSearchDraft(
                                        event.target.value
                                    )
                                }
                                placeholder="Search descriptions…"
                                className="w-44 bg-transparent px-2 py-2 text-sm outline-none"
                            />
                        </form>
                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}


                    {/* TABLE */}

                    <div className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)]">
                        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3 text-xs text-[var(--muted)]">
                            <span>
                                {loading
                                    ? "Loading…"
                                    : `${total.toLocaleString()} entr${
                                          total === 1
                                              ? "y"
                                              : "ies"
                                      }`}
                            </span>
                            <span>
                                Page {data?.page || page} of{" "}
                                {pages}
                            </span>
                        </div>

                        {loading ? (
                            <div className="space-y-px">
                                {Array.from({
                                    length: 8,
                                }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 px-5 py-4"
                                    >
                                        <div className="skeleton h-4 w-32" />
                                        <div className="skeleton h-4 w-24" />
                                        <div className="skeleton h-4 flex-1" />
                                    </div>
                                ))}
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="p-12 text-center text-sm text-[var(--muted)]">
                                No matching activity.
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--border)]">
                                {logs.map((log) => {
                                    const isOpen =
                                        expanded.has(log.id);

                                    const hasDetail =
                                        log.changes.length >
                                            0 ||
                                        log.ipAddress ||
                                        log.userAgent;

                                    return (
                                        <div key={log.id}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    hasDetail &&
                                                    toggleExpanded(
                                                        log.id
                                                    )
                                                }
                                                className={`flex w-full items-start gap-4 px-5 py-4 text-left ${
                                                    hasDetail
                                                        ? "hover:bg-[var(--surface)]"
                                                        : "cursor-default"
                                                }`}
                                            >
                                                <span className="mt-0.5 w-36 shrink-0 text-xs tabular-nums text-[var(--muted)]">
                                                    {formatDateTime(
                                                        log.createdAt
                                                    )}
                                                </span>

                                                <span
                                                    className={`mt-0.5 shrink-0 border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${actionStyle(
                                                        log.action
                                                    )}`}
                                                >
                                                    {actionVerb(
                                                        log.action
                                                    )}
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-sm">
                                                        {
                                                            log.description
                                                        }
                                                    </span>
                                                    <span className="mt-0.5 block text-xs text-[var(--muted)]">
                                                        {RESOURCE_LABEL[
                                                            log
                                                                .resource
                                                        ] ||
                                                            log.resource}
                                                        {" · "}
                                                        {log.admin
                                                            ? log
                                                                  .admin
                                                                  .fullName ||
                                                              log
                                                                  .admin
                                                                  .username
                                                            : "Unknown"}
                                                    </span>
                                                </span>

                                                {hasDetail && (
                                                    <ChevronDown
                                                        size={
                                                            15
                                                        }
                                                        className={`mt-1 shrink-0 text-[var(--muted)] transition-transform ${
                                                            isOpen
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                )}
                                            </button>

                                            {isOpen &&
                                                hasDetail && (
                                                    <div className="border-t border-dashed border-[var(--border)] bg-[var(--surface)]/40 px-5 py-4">
                                                        {log
                                                            .changes
                                                            .length >
                                                            0 && (
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full min-w-[480px] text-xs">
                                                                    <thead>
                                                                        <tr className="text-left text-[10px] uppercase tracking-wider text-[var(--muted)]">
                                                                            <th className="py-1 pr-4 font-semibold">
                                                                                Field
                                                                            </th>
                                                                            <th className="py-1 pr-4 font-semibold">
                                                                                Before
                                                                            </th>
                                                                            <th className="py-1 font-semibold">
                                                                                After
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {log.changes.map(
                                                                            (
                                                                                change,
                                                                                index
                                                                            ) => (
                                                                                <tr
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="align-top"
                                                                                >
                                                                                    <td className="py-1 pr-4 font-medium">
                                                                                        {
                                                                                            change.field
                                                                                        }
                                                                                    </td>
                                                                                    <td className="py-1 pr-4 text-[var(--muted)]">
                                                                                        {change.before ===
                                                                                            null ||
                                                                                        change.before ===
                                                                                            ""
                                                                                            ? "—"
                                                                                            : String(
                                                                                                  change.before
                                                                                              )}
                                                                                    </td>
                                                                                    <td className="py-1 text-[var(--text)]">
                                                                                        {change.after ===
                                                                                            null ||
                                                                                        change.after ===
                                                                                            ""
                                                                                            ? "—"
                                                                                            : String(
                                                                                                  change.after
                                                                                              )}
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}

                                                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[var(--muted)]">
                                                            {log.ipAddress && (
                                                                <span>
                                                                    IP:{" "}
                                                                    {
                                                                        log.ipAddress
                                                                    }
                                                                </span>
                                                            )}
                                                            {log.userAgent && (
                                                                <span className="max-w-full truncate">
                                                                    {
                                                                        log.userAgent
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* PAGINATION */}

                        {pages > 1 && (
                            <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.max(p - 1, 1)
                                        )
                                    }
                                    disabled={
                                        page <= 1 || loading
                                    }
                                    className="flex items-center gap-1 border border-[var(--border)] px-2 py-1 text-sm transition hover:bg-[var(--surface)] disabled:opacity-40"
                                >
                                    <ChevronLeft size={14} />
                                    Prev
                                </button>

                                <span className="text-xs text-[var(--muted)]">
                                    {page} / {pages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(
                                                p + 1,
                                                pages
                                            )
                                        )
                                    }
                                    disabled={
                                        page >= pages || loading
                                    }
                                    className="flex items-center gap-1 border border-[var(--border)] px-2 py-1 text-sm transition hover:bg-[var(--surface)] disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}

export default AuditLogs;
