import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Clock,
    Eye,
    Gauge,
    MonitorSmartphone,
    MousePointerClick,
    RefreshCw,
    Route,
    Users,
} from "lucide-react";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import BarSeries from "../../../components/charts/BarSeries";
import VisitorsSection from "./VisitorsSection";
import { useAuth } from "../../../context/AuthContext";

import {
    getPageAnalytics,
    getInteractionAnalytics,
    getAudienceAnalytics,
    getVisitorFlow,
    getEngagementAnalytics,
    ANALYTICS_PERIODS,
    INTERACTION_ACTION_LABELS,
} from "../../../services/analyticsApi";


// ============================================================
// HELPERS
// ============================================================

const formatNumber = (value) => {
    const number = Number(value) || 0;

    return number.toLocaleString();
};


const formatDuration = (ms) => {
    if (ms === null || ms === undefined || Number.isNaN(ms)) {
        return "—";
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


const formatPagePath = (path) => {
    if (!path) {
        return "—";
    }

    if (path === "/") {
        return "Home";
    }

    return path;
};


const actionLabel = (action) =>
    INTERACTION_ACTION_LABELS[action] || action;


// ISO date -> short label based on the series granularity.
const buildSeriesPoints = (series, granularity, valueKey) => {
    return series.map((point) => {
        const date = new Date(point.date);

        let label;
        let fullLabel;

        if (granularity === "hour") {
            label = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

            fullLabel = date.toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (granularity === "month") {
            label = date.toLocaleDateString([], {
                month: "short",
            });

            fullLabel = date.toLocaleDateString([], {
                month: "long",
                year: "numeric",
            });
        } else {
            label = date.toLocaleDateString([], {
                month: "short",
                day: "numeric",
            });

            fullLabel = date.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
            });
        }

        return {
            label,
            fullLabel,
            value: point[valueKey],
        };
    });
};


// ============================================================
// COMPONENT
// ============================================================

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { admin } = useAuth();

    const [period, setPeriod] = useState("7d");

    const [pageData, setPageData] = useState(null);
    const [interactionData, setInteractionData] =
        useState(null);
    const [audienceData, setAudienceData] = useState(null);
    const [flowData, setFlowData] = useState(null);
    const [engagementData, setEngagementData] =
        useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");


    // ========================================================
    // FETCH
    // ========================================================

    const fetchAnalytics = useCallback(
        async (activePeriod, isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const [
                    pageResponse,
                    interactionResponse,
                    audienceResponse,
                    flowResponse,
                    engagementResponse,
                ] = await Promise.all([
                    getPageAnalytics(activePeriod),
                    getInteractionAnalytics(activePeriod),
                    getAudienceAnalytics(activePeriod),
                    getVisitorFlow(activePeriod),
                    getEngagementAnalytics(activePeriod),
                ]);

                setPageData(pageResponse?.data || null);
                setInteractionData(
                    interactionResponse?.data || null
                );
                setAudienceData(
                    audienceResponse?.data || null
                );
                setFlowData(flowResponse?.data || null);
                setEngagementData(
                    engagementResponse?.data || null
                );
            } catch (err) {
                console.error(
                    "Failed to load analytics:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load analytics."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAnalytics(period);
    }, [period, fetchAnalytics]);


    // ========================================================
    // DERIVED — PAGES
    // ========================================================

    const seriesPoints = useMemo(() => {
        if (!pageData?.series) {
            return [];
        }

        return buildSeriesPoints(
            pageData.series,
            pageData.granularity,
            "views"
        );
    }, [pageData]);

    const totals = pageData?.totals || {
        views: 0,
        uniqueVisitors: 0,
        uniqueSessions: 0,
        avgDurationMs: null,
    };

    const pages = pageData?.pages || [];

    const maxPageViews = pages.reduce(
        (max, page) => Math.max(max, page.views),
        0
    );

    const hasData = totals.views > 0;


    // ========================================================
    // DERIVED — INTERACTIONS
    // ========================================================

    const interactionTotals =
        interactionData?.totals || {
            interactions: 0,
            mostInteractedPage: null,
        };

    const byAction = interactionData?.byAction || [];

    const topTargets = useMemo(
        () => interactionData?.topTargets || {},
        [interactionData]
    );

    // Merge the link-style interactions into one ranked list.
    const topLinks = useMemo(() => {
        const merged = [
            ...(topTargets.EXTERNAL_LINK_CLICK || []),
            ...(topTargets.GITHUB_CLICK || []),
            ...(topTargets.EMAIL_CLICK || []),
        ];

        return merged
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [topTargets]);

    const topProjects = (
        topTargets.PROJECT_OPENED || []
    ).slice(0, 6);

    const hasInteractions =
        interactionTotals.interactions > 0;


    // ========================================================
    // DERIVED — AUDIENCE
    // ========================================================

    const audienceTotals = audienceData?.totals || {
        views: 0,
        visitors: 0,
        geoCoveragePct: 0,
    };

    const devices = audienceData?.devices || [];
    const browsers = audienceData?.browsers || [];
    const operatingSystems = audienceData?.os || [];
    const screens = audienceData?.screens || [];
    const countries = audienceData?.countries || [];
    const cities = audienceData?.cities || [];

    const hasAudience = audienceTotals.views > 0;


    // ========================================================
    // DERIVED — VISITOR FLOW
    // ========================================================

    const flowTotals = flowData?.totals || {
        sessions: 0,
        bounceRate: 0,
        avgPagesPerSession: 0,
    };

    const entryPages = flowData?.entryPages || [];
    const exitPages = flowData?.exitPages || [];
    const transitions = flowData?.transitions || [];
    const paths = flowData?.paths || [];

    const hasFlow = flowTotals.sessions > 0;


    // ========================================================
    // DERIVED — ENGAGEMENT
    // ========================================================

    const engagementTotals = engagementData?.totals || {
        sessions: 0,
        engagementRate: 0,
        avgSessionDurationMs: 0,
        totalTimeMs: 0,
        repeatVisitors: 0,
    };

    const engagementPages = engagementData?.pages || [];

    const activitySeries = useMemo(() => {
        if (!engagementData?.activity) {
            return [];
        }

        return buildSeriesPoints(
            engagementData.activity,
            engagementData.granularity,
            "sessions"
        );
    }, [engagementData]);

    const maxEngagementScore = engagementPages.reduce(
        (max, page) => Math.max(max, page.engagementScore),
        0
    );

    const hasEngagement = engagementPages.length > 0;


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="work-shell min-h-screen">

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen((current) => !current)
                }
            />

            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-12">

                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
                    >
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                                Administration
                            </p>

                            <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                                Analytics.
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                Welcome back,{" "}
                                <span className="font-medium text-[var(--text)]">
                                    {admin?.fullName ||
                                        "Administrator"}
                                </span>
                                . How visitors are using the
                                portfolio.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* PERIOD SELECTOR */}
                            <div className="flex border border-[var(--border)]">
                                {ANALYTICS_PERIODS.map(
                                    (option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setPeriod(
                                                    option.value
                                                )
                                            }
                                            className={`px-3 py-2 text-sm font-semibold transition ${
                                                period ===
                                                option.value
                                                    ? "bg-purple-500 text-white"
                                                    : "hover:bg-[var(--card)]"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    fetchAnalytics(
                                        period,
                                        true
                                    )
                                }
                                disabled={
                                    loading || refreshing
                                }
                                className="flex items-center justify-center border border-[var(--border)] p-2 transition hover:bg-[var(--card)] disabled:opacity-50"
                                aria-label="Refresh"
                            >
                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                            </button>
                        </div>
                    </motion.div>


                    {/* ==========================================
                        ERROR
                    ========================================== */}

                    {error && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/5 p-5">
                            <p className="text-sm font-semibold text-red-400">
                                Unable to load analytics
                            </p>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                                {error}
                            </p>
                        </div>
                    )}


                    {/* ==========================================
                        LOADING
                    ========================================== */}

                    {loading ? (
                        <DashboardSkeleton />
                    ) : !error && !hasData ? (

                        /* ======================================
                            EMPTY
                        ====================================== */

                        <div className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)] p-12 text-center">
                            <BarChart3
                                size={32}
                                className="mx-auto text-[var(--muted)]"
                            />

                            <h2 className="mt-4 text-lg font-semibold">
                                No page views recorded yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                                Visitor activity for this period
                                will appear here once the
                                portfolio starts receiving
                                traffic.
                            </p>
                        </div>

                    ) : !error ? (
                        <>

                            {/* ==============================
                                STAT TILES
                            ============================== */}

                            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <StatTile
                                    icon={Eye}
                                    label="Page views"
                                    value={formatNumber(
                                        totals.views
                                    )}
                                />

                                <StatTile
                                    icon={Users}
                                    label="Unique visitors"
                                    value={formatNumber(
                                        totals.uniqueVisitors
                                    )}
                                    hint={`${formatNumber(
                                        totals.uniqueSessions
                                    )} sessions`}
                                />

                                <StatTile
                                    icon={Clock}
                                    label="Avg. time on page"
                                    value={formatDuration(
                                        totals.avgDurationMs
                                    )}
                                />

                                <StatTile
                                    icon={MousePointerClick}
                                    label="Interactions"
                                    value={formatNumber(
                                        interactionTotals.interactions
                                    )}
                                    hint={
                                        interactionTotals.mostInteractedPage
                                            ? `Most active: ${formatPagePath(
                                                  interactionTotals.mostInteractedPage
                                              )}`
                                            : undefined
                                    }
                                />
                            </section>


                            {/* ==============================
                                TIME SERIES
                            ============================== */}

                            <section className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)] p-6">
                                <div className="mb-4">
                                    <h2 className="font-semibold">
                                        Page views over time
                                    </h2>
                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        {pageData?.granularity ===
                                        "hour"
                                            ? "Hourly"
                                            : pageData?.granularity ===
                                              "month"
                                            ? "Monthly"
                                            : "Daily"}{" "}
                                        totals
                                    </p>
                                </div>

                                <BarSeries
                                    data={seriesPoints}
                                    valueLabel="views"
                                />
                            </section>


                            {/* ==============================
                                PAGES TABLE
                            ============================== */}

                            <section className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)]">
                                <div className="border-b border-[var(--border)] p-5">
                                    <h2 className="font-semibold">
                                        Pages
                                    </h2>
                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        Ranked by views for the
                                        selected period.
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[560px] text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-[var(--muted)]">
                                                <th className="px-5 py-3 font-semibold">
                                                    Page
                                                </th>
                                                <th className="px-5 py-3 text-right font-semibold">
                                                    Views
                                                </th>
                                                <th className="px-5 py-3 text-right font-semibold">
                                                    Unique
                                                </th>
                                                <th className="px-5 py-3 text-right font-semibold">
                                                    Avg. time
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {pages.map(
                                                (page) => (
                                                    <tr
                                                        key={
                                                            page.path
                                                        }
                                                        className="border-b border-[var(--border)] last:border-b-0"
                                                    >
                                                        <td className="px-5 py-3">
                                                            <div className="font-medium">
                                                                {formatPagePath(
                                                                    page.path
                                                                )}
                                                            </div>

                                                            <div className="mt-1.5 h-1 w-full max-w-[220px] bg-[var(--surface)]">
                                                                <div
                                                                    className="h-full bg-purple-500"
                                                                    style={{
                                                                        width: `${
                                                                            maxPageViews >
                                                                            0
                                                                                ? (page.views /
                                                                                      maxPageViews) *
                                                                                  100
                                                                                : 0
                                                                        }%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-3 text-right font-semibold tabular-nums">
                                                            {formatNumber(
                                                                page.views
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-3 text-right tabular-nums text-[var(--muted)]">
                                                            {formatNumber(
                                                                page.uniqueVisitors
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-3 text-right tabular-nums text-[var(--muted)]">
                                                            {formatDuration(
                                                                page.avgDurationMs
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>


                            {/* ==============================
                                ENGAGEMENT
                            ============================== */}

                            <section className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)]">
                                <div className="flex items-center gap-3 border-b border-[var(--border)] p-5">
                                    <Gauge
                                        size={18}
                                        className="text-purple-400"
                                    />
                                    <div>
                                        <h2 className="font-semibold">
                                            Engagement
                                        </h2>
                                        <p className="mt-1 text-xs text-[var(--muted)]">
                                            Depth of attention,
                                            not just traffic.
                                            Score blends time on
                                            page, interactions
                                            per view, and scroll
                                            depth.
                                        </p>
                                    </div>
                                </div>

                                {!hasEngagement ? (
                                    <div className="p-10 text-center text-sm text-[var(--muted)]">
                                        No engagement data for
                                        this period yet.
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 divide-x divide-y divide-[var(--border)] border-b border-[var(--border)] text-center sm:grid-cols-4 sm:divide-y-0">
                                            <div className="p-4">
                                                <p className="text-lg font-bold tabular-nums">
                                                    {formatDuration(
                                                        engagementTotals.avgSessionDurationMs
                                                    )}
                                                </p>
                                                <p className="text-[11px] text-[var(--muted)]">
                                                    Avg. session
                                                </p>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-lg font-bold tabular-nums">
                                                    {
                                                        engagementTotals.engagementRate
                                                    }
                                                    %
                                                </p>
                                                <p className="text-[11px] text-[var(--muted)]">
                                                    Engaged
                                                    sessions
                                                </p>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-lg font-bold tabular-nums">
                                                    {formatNumber(
                                                        engagementTotals.repeatVisitors
                                                    )}
                                                </p>
                                                <p className="text-[11px] text-[var(--muted)]">
                                                    Repeat
                                                    visitors
                                                </p>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-lg font-bold tabular-nums">
                                                    {formatDuration(
                                                        engagementTotals.totalTimeMs
                                                    )}
                                                </p>
                                                <p className="text-[11px] text-[var(--muted)]">
                                                    Total time
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-b border-[var(--border)] p-6">
                                            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                                                Sessions over time
                                            </p>
                                            <BarSeries
                                                data={
                                                    activitySeries
                                                }
                                                valueLabel="sessions"
                                            />
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[640px] text-sm">
                                                <thead>
                                                    <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-[var(--muted)]">
                                                        <th className="px-5 py-3 font-semibold">
                                                            Page
                                                        </th>
                                                        <th className="px-5 py-3 text-right font-semibold">
                                                            Views
                                                        </th>
                                                        <th className="px-5 py-3 text-right font-semibold">
                                                            Avg.
                                                            time
                                                        </th>
                                                        <th className="px-5 py-3 text-right font-semibold">
                                                            Int./view
                                                        </th>
                                                        <th className="px-5 py-3 text-right font-semibold">
                                                            Scroll
                                                        </th>
                                                        <th className="px-5 py-3 text-right font-semibold">
                                                            Score
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {engagementPages.map(
                                                        (
                                                            page
                                                        ) => (
                                                            <tr
                                                                key={
                                                                    page.path
                                                                }
                                                                className="border-b border-[var(--border)] last:border-b-0"
                                                            >
                                                                <td className="px-5 py-3 font-medium">
                                                                    {formatPagePath(
                                                                        page.path
                                                                    )}
                                                                </td>
                                                                <td className="px-5 py-3 text-right tabular-nums text-[var(--muted)]">
                                                                    {formatNumber(
                                                                        page.views
                                                                    )}
                                                                </td>
                                                                <td className="px-5 py-3 text-right tabular-nums text-[var(--muted)]">
                                                                    {formatDuration(
                                                                        page.avgTimeMs
                                                                    )}
                                                                </td>
                                                                <td className="px-5 py-3 text-right tabular-nums text-[var(--muted)]">
                                                                    {
                                                                        page.interactionsPerView
                                                                    }
                                                                </td>
                                                                <td className="px-5 py-3 text-right tabular-nums text-[var(--muted)]">
                                                                    {
                                                                        page.avgScrollDepth
                                                                    }
                                                                    %
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <span className="tabular-nums font-semibold">
                                                                            {
                                                                                page.engagementScore
                                                                            }
                                                                        </span>
                                                                        <span className="h-1.5 w-16 shrink-0 bg-[var(--surface)]">
                                                                            <span
                                                                                className="block h-full bg-purple-500"
                                                                                style={{
                                                                                    width: `${
                                                                                        maxEngagementScore >
                                                                                        0
                                                                                            ? (page.engagementScore /
                                                                                                  maxEngagementScore) *
                                                                                              100
                                                                                            : 0
                                                                                    }%`,
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </section>


                            {/* ==============================
                                INTERACTIONS
                            ============================== */}

                            <section className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)]">
                                <div className="border-b border-[var(--border)] p-5">
                                    <h2 className="font-semibold">
                                        Interactions
                                    </h2>
                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        What visitors clicked,
                                        opened, and scrolled
                                        through.
                                    </p>
                                </div>

                                {!hasInteractions ? (
                                    <div className="p-10 text-center text-sm text-[var(--muted)]">
                                        No interactions recorded
                                        for this period yet.
                                    </div>
                                ) : (
                                    <div className="grid gap-6 p-5 lg:grid-cols-2">
                                        <BarList
                                            title="By type"
                                            rows={byAction.map(
                                                (row) => ({
                                                    label: actionLabel(
                                                        row.action
                                                    ),
                                                    value: row.count,
                                                })
                                            )}
                                        />

                                        <div className="space-y-6">
                                            <BarList
                                                title="Top links"
                                                emptyLabel="No link clicks yet."
                                                rows={topLinks.map(
                                                    (row) => ({
                                                        label: row.target,
                                                        value: row.count,
                                                    })
                                                )}
                                            />

                                            <BarList
                                                title="Most opened projects"
                                                emptyLabel="No projects opened yet."
                                                rows={topProjects.map(
                                                    (row) => ({
                                                        label: row.target,
                                                        value: row.count,
                                                    })
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </section>


                            {/* ==============================
                                AUDIENCE
                            ============================== */}

                            <section className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)]">
                                <div className="flex items-center gap-3 border-b border-[var(--border)] p-5">
                                    <MonitorSmartphone
                                        size={18}
                                        className="text-purple-400"
                                    />
                                    <div>
                                        <h2 className="font-semibold">
                                            Audience
                                        </h2>
                                        <p className="mt-1 text-xs text-[var(--muted)]">
                                            Devices, browsers, and
                                            where visitors are
                                            coming from.
                                        </p>
                                    </div>
                                </div>

                                {!hasAudience ? (
                                    <div className="p-10 text-center text-sm text-[var(--muted)]">
                                        No audience data for this
                                        period yet.
                                    </div>
                                ) : (
                                    <div className="grid gap-6 p-5 md:grid-cols-2 xl:grid-cols-3">
                                        <BarList
                                            title="Device type"
                                            rows={devices.map(
                                                (row) => ({
                                                    label:
                                                        row.type
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        row.type.slice(
                                                            1
                                                        ),
                                                    value: row.views,
                                                })
                                            )}
                                        />

                                        <BarList
                                            title="Browser"
                                            emptyLabel="No browser data."
                                            rows={browsers.map(
                                                (row) => ({
                                                    label: row.name,
                                                    value: row.views,
                                                })
                                            )}
                                        />

                                        <BarList
                                            title="Operating system"
                                            emptyLabel="No OS data."
                                            rows={operatingSystems.map(
                                                (row) => ({
                                                    label: row.name,
                                                    value: row.views,
                                                })
                                            )}
                                        />

                                        <BarList
                                            title="Screen size"
                                            emptyLabel="No screen data."
                                            rows={screens.map(
                                                (row) => ({
                                                    label: row.label,
                                                    value: row.views,
                                                })
                                            )}
                                        />

                                        <div className="md:col-span-2 xl:col-span-1">
                                            <BarList
                                                title="Countries"
                                                emptyLabel={
                                                    audienceTotals.geoCoveragePct ===
                                                    0
                                                        ? "Location data unavailable (GeoIP database not loaded)."
                                                        : "No location data."
                                                }
                                                rows={countries.map(
                                                    (row) => ({
                                                        label: row.country,
                                                        value: row.views,
                                                    })
                                                )}
                                            />
                                        </div>

                                        {cities.length > 0 && (
                                            <div className="md:col-span-2 xl:col-span-1">
                                                <BarList
                                                    title="Cities"
                                                    rows={cities.map(
                                                        (row) => ({
                                                            label: row.country
                                                                ? `${row.city}, ${row.country}`
                                                                : row.city,
                                                            value: row.views,
                                                        })
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {hasAudience &&
                                    audienceTotals.geoCoveragePct >
                                        0 &&
                                    audienceTotals.geoCoveragePct <
                                        100 && (
                                        <p className="border-t border-[var(--border)] px-5 py-3 text-xs text-[var(--muted)]">
                                            Location resolved for{" "}
                                            {
                                                audienceTotals.geoCoveragePct
                                            }
                                            % of views.
                                        </p>
                                    )}
                            </section>


                            {/* ==============================
                                VISITOR FLOW
                            ============================== */}

                            <section className="work-panel mt-6 border border-[var(--border)] bg-[var(--card)]">
                                <div className="flex items-center gap-3 border-b border-[var(--border)] p-5">
                                    <Route
                                        size={18}
                                        className="text-purple-400"
                                    />
                                    <div>
                                        <h2 className="font-semibold">
                                            Visitor flow
                                        </h2>
                                        <p className="mt-1 text-xs text-[var(--muted)]">
                                            How visitors move
                                            through the
                                            portfolio.
                                        </p>
                                    </div>
                                </div>

                                {!hasFlow ? (
                                    <div className="p-10 text-center text-sm text-[var(--muted)]">
                                        Not enough navigation
                                        data for this period
                                        yet.
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-b border-[var(--border)] text-center">
                                            <div className="p-4">
                                                <p className="text-lg font-bold tabular-nums">
                                                    {formatNumber(
                                                        flowTotals.sessions
                                                    )}
                                                </p>
                                                <p className="text-[11px] text-[var(--muted)]">
                                                    Sessions
                                                </p>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-lg font-bold tabular-nums">
                                                    {
                                                        flowTotals.bounceRate
                                                    }
                                                    %
                                                </p>
                                                <p className="text-[11px] text-[var(--muted)]">
                                                    Bounce rate
                                                </p>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-lg font-bold tabular-nums">
                                                    {
                                                        flowTotals.avgPagesPerSession
                                                    }
                                                </p>
                                                <p className="text-[11px] text-[var(--muted)]">
                                                    Pages /
                                                    session
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-6 p-5 md:grid-cols-2">
                                            <BarList
                                                title="Entry pages"
                                                rows={entryPages.map(
                                                    (row) => ({
                                                        label: formatPagePath(
                                                            row.path
                                                        ),
                                                        value: row.count,
                                                    })
                                                )}
                                            />
                                            <BarList
                                                title="Exit pages"
                                                rows={exitPages.map(
                                                    (row) => ({
                                                        label: formatPagePath(
                                                            row.path
                                                        ),
                                                        value: row.count,
                                                    })
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-6 border-t border-[var(--border)] p-5 md:grid-cols-2">
                                            <div>
                                                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                                                    Top transitions
                                                </p>
                                                {transitions.length ===
                                                0 ? (
                                                    <p className="text-sm text-[var(--muted)]">
                                                        No
                                                        multi-page
                                                        sessions
                                                        yet.
                                                    </p>
                                                ) : (
                                                    <ul className="space-y-2 text-sm">
                                                        {transitions.map(
                                                            (
                                                                row,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="flex items-center justify-between gap-3"
                                                                >
                                                                    <span className="truncate">
                                                                        {formatPagePath(
                                                                            row.from
                                                                        )}{" "}
                                                                        <span className="text-[var(--muted)]">
                                                                            →
                                                                        </span>{" "}
                                                                        {formatPagePath(
                                                                            row.to
                                                                        )}
                                                                    </span>
                                                                    <span className="shrink-0 font-semibold tabular-nums">
                                                                        {
                                                                            row.count
                                                                        }
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </div>

                                            <div>
                                                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                                                    Common paths
                                                </p>
                                                {paths.length ===
                                                0 ? (
                                                    <p className="text-sm text-[var(--muted)]">
                                                        No repeated
                                                        paths yet.
                                                    </p>
                                                ) : (
                                                    <ul className="space-y-2 text-sm">
                                                        {paths.map(
                                                            (
                                                                row,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="flex items-start justify-between gap-3"
                                                                >
                                                                    <span className="min-w-0 break-words">
                                                                        {row.steps
                                                                            .map(
                                                                                formatPagePath
                                                                            )
                                                                            .join(
                                                                                " → "
                                                                            )}
                                                                    </span>
                                                                    <span className="shrink-0 font-semibold tabular-nums">
                                                                        {
                                                                            row.count
                                                                        }
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>


                            {/* ==============================
                                VISITORS
                            ============================== */}

                            <VisitorsSection
                                key={period}
                                period={period}
                            />

                        </>
                    ) : null}

                </div>
            </main>
        </div>
    );
}


// ============================================================
// STAT TILE
// ============================================================

function StatTile({ icon: Icon, label, value, hint }) {
    return (
        <div className="work-panel border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs text-[var(--muted)]">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold tabular-nums">
                        {value}
                    </p>

                    {hint && (
                        <p className="mt-1 truncate text-xs text-[var(--muted)]">
                            {hint}
                        </p>
                    )}
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-purple-500/10 text-purple-400">
                    <Icon size={19} />
                </div>
            </div>
        </div>
    );
}


// ============================================================
// BAR LIST
// ============================================================

function BarList({ title, rows, emptyLabel = "No data yet." }) {
    const max = rows.reduce(
        (value, row) => Math.max(value, row.value),
        0
    );

    return (
        <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {title}
            </p>

            {rows.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">
                    {emptyLabel}
                </p>
            ) : (
                <div className="space-y-2.5">
                    {rows.map((row, index) => (
                        <div key={`${row.label}-${index}`}>
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="truncate text-sm">
                                    {row.label}
                                </span>
                                <span className="shrink-0 text-sm font-semibold tabular-nums">
                                    {row.value.toLocaleString()}
                                </span>
                            </div>

                            <div className="mt-1 h-1 w-full bg-[var(--surface)]">
                                <div
                                    className="h-full bg-purple-500"
                                    style={{
                                        width: `${
                                            max > 0
                                                ? (row.value /
                                                      max) *
                                                  100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


// ============================================================
// SKELETON
// ============================================================

function DashboardSkeleton() {
    return (
        <div className="mt-8 space-y-6">

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="work-panel border border-[var(--border)] bg-[var(--card)] p-5"
                    >
                        <div className="skeleton h-3 w-24" />
                        <div className="skeleton mt-3 h-7 w-20" />
                    </div>
                ))}
            </div>

            <div className="work-panel border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="skeleton h-4 w-40" />
                <div className="skeleton mt-2 h-3 w-24" />
                <div className="skeleton mt-5 h-40 w-full" />
            </div>

            {Array.from({ length: 2 }).map((_, panel) => (
                <div
                    key={panel}
                    className="work-panel border border-[var(--border)] bg-[var(--card)]"
                >
                    <div className="border-b border-[var(--border)] p-5">
                        <div className="skeleton h-4 w-20" />
                        <div className="skeleton mt-2 h-3 w-56" />
                    </div>

                    {Array.from({ length: 4 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-4 border-b border-[var(--border)] p-5 last:border-b-0"
                            >
                                <div className="skeleton h-4 w-40" />
                                <div className="skeleton h-4 w-10" />
                            </div>
                        )
                    )}
                </div>
            ))}
        </div>
    );
}


export default Dashboard;
