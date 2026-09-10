import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import SectionTitle from "../components/SectionTitle";
import { getPublicAnalytics } from "../services/publicAnalyticsApi";


const num = (value) => (Number(value) || 0).toLocaleString();


// ============================================================
// INSIGHTS
// ============================================================
//
// A small, count-only snapshot of how the portfolio is being
// used. Aggregated and anonymous. Renders nothing until there
// is real data, so it never shows an empty or broken state.
// ============================================================

function Insights() {
    const [data, setData] = useState(null);

    useEffect(() => {
        let cancelled = false;

        getPublicAnalytics()
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                }
            })
            .catch(() => {
                // Silent — the section simply won't render.
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const totals = data?.totals;

    if (!totals || totals.pageViews <= 0) {
        return null;
    }

    const stats = [
        {
            label: "Visitors",
            value: num(totals.visitors),
            hint: "unique devices",
        },
        {
            label: "Page views",
            value: num(totals.pageViews),
            hint: "pages opened",
        },
        {
            label: "Interactions",
            value: num(totals.interactions),
            hint: "clicks & scrolls",
        },
        {
            label: "Projects opened",
            value: num(data.activity?.projectsOpened),
            hint: "detail views",
        },
    ];

    return (
        <section className="relative px-6 py-24 md:px-10 md:py-32 lg:px-16">
            <div className="mx-auto max-w-[1100px]">

                <SectionTitle
                    label="Insights"
                    title="Portfolio in numbers"
                    description={`Anonymous, aggregated activity over the last ${data.windowDays} days.`}
                />

                <div className="mt-12 grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.06,
                            }}
                            className="bg-[var(--card)] p-6 md:p-7"
                        >
                            <p className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                                {stat.value}
                            </p>
                            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                                {stat.label}
                            </p>
                            {stat.hint && (
                                <p className="mt-1 text-[11px] text-[var(--muted)]/70">
                                    {stat.hint}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default Insights;
