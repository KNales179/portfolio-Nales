import { useCallback, useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    MousePointerClick,
    Users,
    X,
} from "lucide-react";

import {
    getVisitors,
    getVisitorDetail,
    INTERACTION_ACTION_LABELS,
} from "../../../services/analyticsApi";


// ============================================================
// HELPERS
// ============================================================

const PAGE_SIZE = 25;


const num = (value) => (Number(value) || 0).toLocaleString();


const formatDuration = (ms) => {
    if (!ms || Number.isNaN(ms)) {
        return "0s";
    }

    const totalSeconds = Math.round(Number(ms) / 1000);

    if (totalSeconds < 60) {
        return `${totalSeconds}s`;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds
        .toString()
        .padStart(2, "0")}s`;
};


const formatDateTime = (value) => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


const formatPath = (path) =>
    path === "/" ? "Home" : path;


const actionLabel = (action) =>
    INTERACTION_ACTION_LABELS[action] || action;


const flag = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) {
        return "";
    }

    return String.fromCodePoint(
        ...[...countryCode.toUpperCase()].map(
            (char) => 0x1f1e6 + char.charCodeAt(0) - 65
        )
    );
};


// ============================================================
// VISITOR DETAIL MODAL
// ============================================================

function VisitorDetailModal({ detail, loading, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8">
            <div className="w-full max-w-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">

                <div className="sticky top-0 flex items-start justify-between border-b border-[var(--border)] bg-[var(--card)] p-5">
                    <div>
                        <h3 className="font-semibold">
                            {loading || !detail
                                ? "Visitor"
                                : detail.visitor.label}
                        </h3>
                        {detail && !loading && (
                            <p className="mt-1 text-xs text-[var(--muted)]">
                                {flag(
                                    detail.visitor.countryCode
                                )}{" "}
                                {detail.visitor.city
                                    ? `${detail.visitor.city}, `
                                    : ""}
                                {detail.visitor.country ||
                                    "Unknown location"}
                                {" · "}
                                {detail.visitor.device.type}
                                {detail.visitor.device.browser
                                    ? ` · ${detail.visitor.device.browser}`
                                    : ""}
                                {detail.visitor.device.os
                                    ? ` · ${detail.visitor.device.os}`
                                    : ""}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[var(--muted)] transition hover:text-[var(--text)]"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {loading || !detail ? (
                    <div className="space-y-3 p-5">
                        <div className="skeleton h-16 w-full" />
                        <div className="skeleton h-24 w-full" />
                        <div className="skeleton h-40 w-full" />
                    </div>
                ) : (
                    <div className="p-5">

                        {/* SUMMARY */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                {
                                    label: "Sessions",
                                    value: num(
                                        detail.visitor
                                            .sessionCount
                                    ),
                                },
                                {
                                    label: "Page views",
                                    value: num(
                                        detail.visitor
                                            .pageViews
                                    ),
                                },
                                {
                                    label: "Interactions",
                                    value: num(
                                        detail.visitor
                                            .interactions
                                    ),
                                },
                                {
                                    label: "Time on site",
                                    value: formatDuration(
                                        detail.visitor
                                            .totalDurationMs
                                    ),
                                },
                            ].map((tile) => (
                                <div
                                    key={tile.label}
                                    className="border border-[var(--border)] p-3"
                                >
                                    <p className="text-[11px] text-[var(--muted)]">
                                        {tile.label}
                                    </p>
                                    <p className="mt-1 text-lg font-bold tabular-nums">
                                        {tile.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-3 text-xs text-[var(--muted)]">
                            First seen{" "}
                            {formatDateTime(
                                detail.visitor.firstSeen
                            )}{" "}
                            · last seen{" "}
                            {formatDateTime(
                                detail.visitor.lastSeen
                            )}
                            {detail.visitor.returning
                                ? " · returning visitor"
                                : ""}
                        </p>

                        {/* SESSIONS */}
                        <h4 className="mt-6 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                            Sessions
                        </h4>
                        <div className="mt-2 space-y-2">
                            {detail.sessions.map(
                                (session) => (
                                    <div
                                        key={
                                            session.sessionId
                                        }
                                        className="border border-[var(--border)] p-3 text-xs"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-[var(--muted)]">
                                                {formatDateTime(
                                                    session.startedAt
                                                )}
                                            </span>
                                            <span className="tabular-nums text-[var(--muted)]">
                                                {
                                                    session.pageViews
                                                }{" "}
                                                views ·{" "}
                                                {
                                                    session.interactions
                                                }{" "}
                                                interactions
                                            </span>
                                        </div>
                                        <div className="mt-1.5">
                                            {formatPath(
                                                session.entryPage
                                            )}{" "}
                                            <span className="text-[var(--muted)]">
                                                →
                                            </span>{" "}
                                            {formatPath(
                                                session.exitPage
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* TIMELINE */}
                        <h4 className="mt-6 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                            Timeline
                        </h4>
                        <ol className="mt-2 space-y-1.5 border-l border-[var(--border)] pl-4">
                            {detail.timeline.map(
                                (event, index) => (
                                    <li
                                        key={index}
                                        className="relative text-xs"
                                    >
                                        <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-purple-500" />

                                        {event.type ===
                                        "PAGE_VIEW" ? (
                                            <span>
                                                Viewed{" "}
                                                <span className="font-medium">
                                                    {formatPath(
                                                        event.path
                                                    )}
                                                </span>
                                            </span>
                                        ) : event.type ===
                                          "PAGE_EXIT" ? (
                                            <span className="text-[var(--muted)]">
                                                Left{" "}
                                                {formatPath(
                                                    event.path
                                                )}{" "}
                                                after{" "}
                                                {formatDuration(
                                                    event.durationMs
                                                )}
                                            </span>
                                        ) : (
                                            <span>
                                                <MousePointerClick
                                                    size={11}
                                                    className="mr-1 inline"
                                                />
                                                {actionLabel(
                                                    event.action
                                                )}
                                                {event.target
                                                    ? ` · ${event.target}`
                                                    : ""}
                                            </span>
                                        )}

                                        <span className="ml-2 text-[10px] text-[var(--muted)]">
                                            {new Date(
                                                event.at
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                }
                                            )}
                                        </span>
                                    </li>
                                )
                            )}
                        </ol>

                        {detail.visitor.truncated && (
                            <p className="mt-3 text-xs text-[var(--muted)]">
                                Showing the most recent 1,000
                                events.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


// ============================================================
// VISITORS SECTION
// ============================================================

function VisitorsSection({ period }) {
    const [visitors, setVisitors] = useState([]);
    const [total, setTotal] = useState(0);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedHash, setSelectedHash] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);


    const fetchList = useCallback(
        async (activePeriod, activeSkip) => {
            try {
                setLoading(true);
                setError("");

                const response = await getVisitors(
                    activePeriod,
                    { limit: PAGE_SIZE, skip: activeSkip }
                );

                setVisitors(
                    response?.data?.visitors || []
                );
                setTotal(response?.data?.total || 0);
            } catch (err) {
                console.error(
                    "Failed to load visitors:",
                    err
                );
                setError(
                    err?.message ||
                    "Unable to load visitors."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );


    // The parent remounts this component (key={period}) when the
    // period changes, so skip always starts at 0 for a new period.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchList(period, skip);
    }, [period, skip, fetchList]);


    const openVisitor = async (hash) => {
        setSelectedHash(hash);
        setDetail(null);
        setDetailLoading(true);

        try {
            const response = await getVisitorDetail(
                hash,
                period
            );
            setDetail(response?.data || null);
        } catch (err) {
            console.error(
                "Failed to load visitor detail:",
                err
            );
            setDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };


    const closeVisitor = () => {
        setSelectedHash(null);
        setDetail(null);
    };


    const page = Math.floor(skip / PAGE_SIZE) + 1;
    const pageCount = Math.max(
        1,
        Math.ceil(total / PAGE_SIZE)
    );


    return (
        <section className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-3 border-b border-[var(--border)] p-5">
                <Users
                    size={18}
                    className="text-purple-400"
                />
                <div>
                    <h2 className="font-semibold">
                        Visitors
                    </h2>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                        {total > 0
                            ? `${num(total)} anonymous visitor${
                                  total === 1 ? "" : "s"
                              } in this period`
                            : "One row per anonymous visitor. Click a row for their full activity."}
                    </p>
                </div>
            </div>

            {error ? (
                <div className="p-6 text-sm text-red-400">
                    {error}
                </div>
            ) : loading ? (
                <div className="space-y-2 p-5">
                    {Array.from({ length: 6 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="skeleton h-10 w-full"
                            />
                        )
                    )}
                </div>
            ) : visitors.length === 0 ? (
                <div className="p-10 text-center text-sm text-[var(--muted)]">
                    No visitors recorded for this period yet.
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-[var(--muted)]">
                                    <th className="px-5 py-3 font-semibold">
                                        Visitor
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Location
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Device
                                    </th>
                                    <th className="px-5 py-3 text-right font-semibold">
                                        Sessions
                                    </th>
                                    <th className="px-5 py-3 text-right font-semibold">
                                        Views
                                    </th>
                                    <th className="px-5 py-3 text-right font-semibold">
                                        Interactions
                                    </th>
                                    <th className="px-5 py-3 text-right font-semibold">
                                        Last seen
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {visitors.map((visitor) => (
                                    <tr
                                        key={
                                            visitor.visitorHash
                                        }
                                        onClick={() =>
                                            openVisitor(
                                                visitor.visitorHash
                                            )
                                        }
                                        className="cursor-pointer border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--surface)]"
                                    >
                                        <td className="px-5 py-3 font-medium">
                                            {visitor.label}
                                            {visitor.returning && (
                                                <span className="ml-2 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400">
                                                    returning
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-[var(--muted)]">
                                            {flag(
                                                visitor.countryCode
                                            )}{" "}
                                            {visitor.country ||
                                                "Unknown"}
                                        </td>
                                        <td className="px-5 py-3 text-[var(--muted)]">
                                            {visitor.deviceType}
                                            {visitor.browser
                                                ? ` · ${visitor.browser}`
                                                : ""}
                                        </td>
                                        <td className="px-5 py-3 text-right tabular-nums">
                                            {num(
                                                visitor.sessionCount
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-right tabular-nums">
                                            {num(
                                                visitor.pageViews
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-right tabular-nums">
                                            {num(
                                                visitor.interactions
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-right text-[var(--muted)]">
                                            {formatDateTime(
                                                visitor.lastSeen
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pageCount > 1 && (
                        <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] px-5 py-3 text-xs">
                            <span className="text-[var(--muted)]">
                                Page {page} of {pageCount}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={skip === 0}
                                    onClick={() =>
                                        setSkip(
                                            Math.max(
                                                0,
                                                skip -
                                                    PAGE_SIZE
                                            )
                                        )
                                    }
                                    className="flex items-center gap-1 border border-[var(--border)] px-2.5 py-1.5 font-semibold transition hover:bg-[var(--surface)] disabled:opacity-40"
                                >
                                    <ChevronLeft size={14} />
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        skip + PAGE_SIZE >=
                                        total
                                    }
                                    onClick={() =>
                                        setSkip(
                                            skip + PAGE_SIZE
                                        )
                                    }
                                    className="flex items-center gap-1 border border-[var(--border)] px-2.5 py-1.5 font-semibold transition hover:bg-[var(--surface)] disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {selectedHash && (
                <VisitorDetailModal
                    detail={detail}
                    loading={detailLoading}
                    onClose={closeVisitor}
                />
            )}
        </section>
    );
}

export default VisitorsSection;
