// ============================================================
// PLAY — SHARED SECTION PRIMITIVES
// ============================================================
//
// Small building blocks every preset variant reuses so they
// stay consistent on the token layer while differing in layout.
// All colours come from the scoped --play-* custom properties.
// ============================================================

export function PlaySection({
    id,
    className = "",
    children,
}) {
    return (
        <section
            id={id}
            className={`relative w-full px-6 md:px-10 lg:px-16 ${className}`}
            style={{
                paddingTop: "var(--play-section-y)",
                paddingBottom: "var(--play-section-y)",
            }}
        >
            <div
                className="mx-auto w-full"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                {children}
            </div>
        </section>
    );
}


export function Display({
    as: Tag = "h2",
    className = "",
    children,
    style,
}) {
    return (
        <Tag
            className={className}
            style={{
                fontFamily: "var(--play-font-head)",
                ...style,
            }}
        >
            {children}
        </Tag>
    );
}


export function Kicker({ children, className = "" }) {
    return (
        <p
            className={`text-xs font-semibold uppercase tracking-[0.28em] ${className}`}
            style={{ color: "var(--play-accent)" }}
        >
            {children}
        </p>
    );
}


export function Rule({ className = "" }) {
    return (
        <div
            className={`w-full ${className}`}
            style={{
                height: "var(--play-border-width, 1px)",
                backgroundColor: "var(--play-border)",
            }}
        />
    );
}
