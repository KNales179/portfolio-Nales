import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    Eye,
    Gauge,
    MousePointerClick,
    Users,
} from "lucide-react";

import BarSeries from "../components/charts/BarSeries";
import { getPublicAnalytics } from "../services/publicAnalyticsApi";


// ============================================================
// HELPERS
// ============================================================

const num = (value) => (Number(value) || 0).toLocaleString();


const formatDuration = (ms) => {
    const totalSeconds = Math.round((Number(ms) || 0) / 1000);

    if (totalSeconds < 60) {
        return `${totalSeconds}s`;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds
        .toString()
        .padStart(2, "0")}s`;
};


const formatPath = (path) => {
    if (!path) {
        return "—";
    }

    return path === "/" ? "Home" : path;
};


// ============================================================
// COMPONENT
// ============================================================

function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const result = await getPublicAnalytics();
                if (!cancelled) {
                    setData(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                        "Unable to load insights."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);


    const trendPoints = useMemo(() => {
        if (!data?.trend) {
            return [];
        }

        return data.trend.map((point) => {
            const date = new Date(point.date);

            return {
                label: date.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                }),
                fullLabel: date.toLocaleDateString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                }),
                value: point.visitors,
            };
        });
    }, [data]);


    const totals = data?.totals;
    const hasData = totals && totals.pageViews > 0;


    return (
        <section className="min-h-screen px-6 py-32 md:px-10 lg:px-16">
            <div className="mx-auto max-w-[1100px]">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4">
                        <h1 className="heading-font text-4xl font-bold tracking-tight md:text-5xl">
                            <span className="text-[var(--accent)]">
                                #
                            </span>{" "}
                            Insights
                        </h1>
                        <div className="h-px flex-1 bg-[var(--border)]" />
                    </div>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                        A live, anonymous look at how this
                        portfolio is being used — aggregated
                        over the last 30 days. No accounts, no
                        tracking of individuals, just the
                        overall story.
                    </p>
                </motion.div>


                {loading ? (
                    <p className="text-sm text-[var(--muted)]">
                        Loading insights…
                    </p>
                ) : error ? (
                    <p className="text-sm text-[var(--muted)]">
                        {error}
                    </p>
                ) : !hasData ? (
                    <p className="text-sm text-[var(--muted)]">
                        Not enough activity recorded yet —
                        check back soon.
                    </p>
                ) : (
                    <div className="space-y-14">

                        {/* HEADLINE STATS */}
                        <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: Users,
                                    label: "Visitors",
                                    value: num(
                                        totals.visitors
                                    ),
                                },
                                {
                                    icon: Eye,
                                    label: "Page views",
                                    value: num(
                                        totals.pageViews
                                    ),
                                },
                                {
                                    icon: Clock,
                                    label: "Avg. visit",
                                    value: formatDuration(
                                        totals.avgSessionDurationMs
                                    ),
                                },
                                {
                                    icon: Gauge,
                                    label: "Engagement",
                                    value: `${totals.engagementRate}%`,
                                },
                            ].map((stat, index) => {
                                const Icon = stat.icon;

                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{
                                            opacity: 0,
                                            y: 16,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        viewport={{
                                            once: true,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay:
                                                index * 0.06,
                                        }}
                                        className="bg-[var(--card)] p-6"
                                    >
                                        <Icon
                                            size={18}
                                            className="text-[var(--accent)]"
                                        />
                                        <p className="mt-4 text-3xl font-bold tracking-tight">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>


                        {/* MOST VIEWED / MOST INTERACTIVE */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="border border-[var(--border)] bg-[var(--card)] p-6">
                                <p className="text-xs uppercase tracking-[0.15em] text-[var(--accent)]">
                                    Most visited
                                </p>
                                <p className="heading-font mt-3 text-2xl font-bold">
                                    {formatPath(
                                        data.mostViewedPage
                                    )}
                                </p>
                            </div>
                            <div className="border border-[var(--border)] bg-[var(--card)] p-6">
                                <p className="text-xs uppercase tracking-[0.15em] text-[var(--accent)]">
                                    Most interactive
                                </p>
                                <p className="heading-font mt-3 text-2xl font-bold">
                                    {formatPath(
                                        data.mostInteractedPage
                                    )}
                                </p>
                            </div>
                        </div>


                        {/* VISITOR TREND */}
                        <div className="border border-[var(--border)] bg-[var(--card)] p-6">
                            <h2 className="heading-font text-xl font-bold">
                                Visitors over time
                            </h2>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                                Daily unique visitors, last 30
                                days
                            </p>
                            <div className="mt-5">
                                <BarSeries
                                    data={trendPoints}
                                    valueLabel="visitors"
                                />
                            </div>
                        </div>


                        {/* PORTFOLIO ACTIVITY */}
                        <div>
                            <h2 className="heading-font mb-6 text-xl font-bold">
                                <span className="text-[var(--accent)]">
                                    #
                                </span>{" "}
                                Portfolio activity
                            </h2>

                            <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    {
                                        label: "Total interactions",
                                        value: num(
                                            totals.interactions
                                        ),
                                    },
                                    {
                                        label: "Projects opened",
                                        value: num(
                                            data.activity
                                                .projectsOpened
                                        ),
                                    },
                                    {
                                        label: "Résumé downloads",
                                        value: num(
                                            data.activity
                                                .resumeDownloads
                                        ),
                                    },
                                    {
                                        label: "External link clicks",
                                        value: num(
                                            data.activity
                                                .externalLinkClicks
                                        ),
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="bg-[var(--card)] p-6"
                                    >
                                        <MousePointerClick
                                            size={16}
                                            className="text-[var(--accent)]"
                                        />
                                        <p className="mt-3 text-2xl font-bold">
                                            {item.value}
                                        </p>
                                        <p className="mt-1 text-xs text-[var(--muted)]">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <p className="text-xs text-[var(--muted)]">
                            Aggregated & anonymous · last{" "}
                            {data.windowDays} days · refreshed
                            every few minutes
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Analytics;
