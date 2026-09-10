import { Suspense } from "react";


// ============================================================
// SectionBoundary
// ============================================================
//
// Suspense wrapper for the section list — some variants (the
// Spatial galaxy, which pulls in three.js) are lazy-loaded.
// ============================================================

function Fallback() {
    return (
        <div
            className="flex min-h-[70vh] items-center justify-center"
            style={{ color: "var(--play-muted)" }}
        >
            <span className="text-sm tracking-wide">
                Loading…
            </span>
        </div>
    );
}


function SectionBoundary({ children }) {
    return (
        <Suspense fallback={<Fallback />}>{children}</Suspense>
    );
}

export default SectionBoundary;
