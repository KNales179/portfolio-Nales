import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { motion } from "framer-motion";
import {
    Archive,
    ArchiveRestore,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Mail,
    MailOpen,
    RefreshCw,
    Reply,
    Search,
    Trash2,
    TriangleAlert,
} from "lucide-react";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
    fetchMessages,
    setMessageStatus,
    archiveMessage,
    restoreMessage,
    deleteMessage,
} from "../../../services/messagesApi";


// ============================================================
// HELPERS
// ============================================================

const PAGE_SIZE = 20;

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

const STATUS_FILTERS = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
];


// ============================================================
// COMPONENT
// ============================================================

function Messages() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [box, setBox] = useState("inbox");
    const [status, setStatus] = useState("all");
    const [searchDraft, setSearchDraft] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [busyId, setBusyId] = useState(null);


    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const result = await fetchMessages({
                box,
                status,
                q: query,
                page,
                limit: PAGE_SIZE,
            });
            setData(result);
        } catch (err) {
            setError(
                err?.message || "Unable to load messages."
            );
        } finally {
            setLoading(false);
        }
    }, [box, status, query, page]);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, [load]);


    const messages = useMemo(
        () => data?.messages || [],
        [data]
    );
    const pages = data?.pages || 1;
    const total = data?.total || 0;
    const unread = data?.unread || 0;


    const patchLocal = (id, patch) => {
        setData((current) => {
            if (!current) {
                return current;
            }
            return {
                ...current,
                messages: current.messages.map((m) =>
                    m.id === id ? { ...m, ...patch } : m
                ),
            };
        });
    };


    const toggleExpanded = async (message) => {
        if (expanded === message.id) {
            setExpanded(null);
            return;
        }
        setExpanded(message.id);
        setConfirmDelete(null);

        if (
            message.status === "unread" &&
            !message.archivedAt
        ) {
            patchLocal(message.id, { status: "read" });
            setData((current) =>
                current
                    ? {
                          ...current,
                          unread: Math.max(
                              0,
                              current.unread - 1
                          ),
                      }
                    : current
            );
            try {
                await setMessageStatus(message.id, "read");
            } catch {
                // non-critical — the row just stays "read" locally
            }
        }
    };


    const runAction = async (id, fn, after) => {
        setBusyId(id);
        try {
            await fn(id);
            after();
        } catch (err) {
            setError(err?.message || "Action failed.");
        } finally {
            setBusyId(null);
        }
    };


    const onToggleRead = (message) =>
        runAction(
            message.id,
            (id) =>
                setMessageStatus(
                    id,
                    message.status === "unread"
                        ? "read"
                        : "unread"
                ),
            () => load()
        );

    const onArchive = (id) =>
        runAction(id, archiveMessage, () => {
            setExpanded(null);
            load();
        });

    const onRestore = (id) =>
        runAction(id, restoreMessage, () => {
            setExpanded(null);
            load();
        });

    const onDelete = (id) =>
        runAction(id, deleteMessage, () => {
            setConfirmDelete(null);
            setExpanded(null);
            load();
        });


    const changeFilter = (fn) => {
        setPage(1);
        setExpanded(null);
        setConfirmDelete(null);
        fn();
    };

    const submitSearch = (event) => {
        event.preventDefault();
        changeFilter(() => setQuery(searchDraft.trim()));
    };


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
                <div className="mx-auto max-w-[1000px] px-5 py-8 md:px-10 lg:px-12">

                    {/* HEADER */}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                    >
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                                Portfolio
                            </p>
                            <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                                Messages.
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                Everything sent through the
                                contact form.{" "}
                                {unread > 0 && (
                                    <span className="text-[var(--text)]">
                                        {unread} unread.
                                    </span>
                                )}
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
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                            Refresh
                        </button>
                    </motion.div>


                    {/* CONTROLS */}

                    <div className="mt-8 flex flex-wrap items-center gap-2">
                        <div className="flex border border-[var(--border)]">
                            {[
                                { value: "inbox", label: "Inbox" },
                                {
                                    value: "archived",
                                    label: "Archived",
                                },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        changeFilter(() =>
                                            setBox(
                                                option.value
                                            )
                                        )
                                    }
                                    className={`px-3 py-2 text-sm font-semibold transition ${
                                        box === option.value
                                            ? "bg-purple-500 text-white"
                                            : "hover:bg-[var(--card)]"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {box === "inbox" && (
                            <select
                                value={status}
                                onChange={(event) =>
                                    changeFilter(() =>
                                        setStatus(
                                            event.target
                                                .value
                                        )
                                    )
                                }
                                className="border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                            >
                                {STATUS_FILTERS.map((f) => (
                                    <option
                                        key={f.value}
                                        value={f.value}
                                    >
                                        {f.label}
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
                                placeholder="Search name, email, subject…"
                                className="w-52 bg-transparent px-2 py-2 text-sm outline-none"
                            />
                        </form>
                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}


                    {/* LIST */}

                    <div className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)]">
                        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3 text-xs text-[var(--muted)]">
                            <span>
                                {loading
                                    ? "Loading…"
                                    : `${total.toLocaleString()} message${
                                          total === 1
                                              ? ""
                                              : "s"
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
                                    length: 6,
                                }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 px-5 py-4"
                                    >
                                        <div className="skeleton h-4 w-40" />
                                        <div className="skeleton h-4 flex-1" />
                                        <div className="skeleton h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="p-12 text-center text-sm text-[var(--muted)]">
                                {box === "archived"
                                    ? "Nothing archived."
                                    : query
                                    ? "No messages match that search."
                                    : "No messages yet."}
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--border)]">
                                {messages.map((message) => {
                                    const isOpen =
                                        expanded ===
                                        message.id;
                                    const isUnread =
                                        message.status ===
                                            "unread" &&
                                        !message.archivedAt;
                                    const busy =
                                        busyId ===
                                        message.id;

                                    return (
                                        <div
                                            key={message.id}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleExpanded(
                                                        message
                                                    )
                                                }
                                                className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-[var(--surface)]"
                                            >
                                                <span
                                                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                        isUnread
                                                            ? "bg-purple-500"
                                                            : "bg-transparent"
                                                    }`}
                                                />

                                                <span className="min-w-0 flex-1">
                                                    <span className="flex flex-wrap items-baseline gap-x-2">
                                                        <span
                                                            className={`text-sm ${
                                                                isUnread
                                                                    ? "font-bold"
                                                                    : "font-medium"
                                                            }`}
                                                        >
                                                            {
                                                                message.name
                                                            }
                                                        </span>
                                                        <span className="text-xs text-[var(--muted)]">
                                                            {
                                                                message.email
                                                            }
                                                        </span>
                                                    </span>
                                                    <span className="mt-0.5 block truncate text-sm text-[var(--text)]">
                                                        {
                                                            message.subject
                                                        }
                                                    </span>
                                                    <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
                                                        {
                                                            message.message
                                                        }
                                                    </span>
                                                </span>

                                                <span className="flex shrink-0 flex-col items-end gap-1">
                                                    <span className="text-xs tabular-nums text-[var(--muted)]">
                                                        {formatDateTime(
                                                            message.createdAt
                                                        )}
                                                    </span>
                                                    {!message.emailDelivered && (
                                                        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                                                            <TriangleAlert
                                                                size={
                                                                    11
                                                                }
                                                            />
                                                            email
                                                            failed
                                                        </span>
                                                    )}
                                                </span>

                                                <ChevronDown
                                                    size={15}
                                                    className={`mt-1 shrink-0 text-[var(--muted)] transition-transform ${
                                                        isOpen
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>

                                            {isOpen && (
                                                <div className="border-t border-dashed border-[var(--border)] bg-[var(--surface)]/40 px-5 py-4">
                                                    <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">
                                                        {
                                                            message.message
                                                        }
                                                    </p>

                                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                                        <a
                                                            href={`mailto:${encodeURIComponent(
                                                                message.email
                                                            )}?subject=${encodeURIComponent(
                                                                `Re: ${message.subject}`
                                                            )}`}
                                                            className="inline-flex items-center gap-1.5 border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20"
                                                        >
                                                            <Reply
                                                                size={
                                                                    13
                                                                }
                                                            />
                                                            Reply
                                                        </a>

                                                        {!message.archivedAt && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    onToggleRead(
                                                                        message
                                                                    )
                                                                }
                                                                disabled={
                                                                    busy
                                                                }
                                                                className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-xs transition hover:bg-[var(--card)] disabled:opacity-50"
                                                            >
                                                                {message.status ===
                                                                "unread" ? (
                                                                    <MailOpen
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Mail
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                )}
                                                                Mark{" "}
                                                                {message.status ===
                                                                "unread"
                                                                    ? "read"
                                                                    : "unread"}
                                                            </button>
                                                        )}

                                                        {message.archivedAt ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    onRestore(
                                                                        message.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    busy
                                                                }
                                                                className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-xs transition hover:bg-[var(--card)] disabled:opacity-50"
                                                            >
                                                                <ArchiveRestore
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                                Restore
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    onArchive(
                                                                        message.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    busy
                                                                }
                                                                className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-xs transition hover:bg-[var(--card)] disabled:opacity-50"
                                                            >
                                                                <Archive
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                                Archive
                                                            </button>
                                                        )}

                                                        {confirmDelete ===
                                                        message.id ? (
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onDelete(
                                                                            message.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        busy
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                    Delete
                                                                    forever
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setConfirmDelete(
                                                                            null
                                                                        )
                                                                    }
                                                                    className="px-2 py-1.5 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setConfirmDelete(
                                                                        message.id
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--muted)] transition hover:text-red-400"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>

                                                    <p className="mt-3 text-[11px] text-[var(--muted)]">
                                                        {message.emailDelivered
                                                            ? "Notification email sent."
                                                            : "Notification email did not send — this copy is your record."}
                                                    </p>
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
                                        page >= pages ||
                                        loading
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

export default Messages;
