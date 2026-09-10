import { usePreset } from "./PresetContext";
import { usePlayContent } from "./content/usePlayContent";
import { SECTIONS, NAVS } from "./sections/registry";


// ============================================================
// LAYOUT RENDERER
// ============================================================
//
// Translates the active preset's layout config into a page:
// which nav variant, which sections in which order, and which
// variant component renders each section. The section
// components receive the shared content — never a preset-
// specific data shape.
// ============================================================

function LayoutSkeleton() {
    return (
        <div
            className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col gap-6 px-6 py-32"
        >
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-16 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="skeleton h-28" />
                <div className="skeleton h-28" />
                <div className="skeleton h-28" />
            </div>
        </div>
    );
}


function LayoutRenderer() {
    const { preset } = usePreset();
    const data = usePlayContent();

    const { order, variants, nav } = preset.layout;

    const Nav = NAVS[nav] || NAVS.minimal;

    if (data.loading) {
        return (
            <>
                <Nav order={order} data={data} />
                <LayoutSkeleton />
            </>
        );
    }

    return (
        <>
            <Nav order={order} data={data} />
            <main>
                {order.map((key) => {
                    const variant = variants[key];
                    const Component =
                        SECTIONS[key]?.[variant];

                    if (!Component) {
                        return null;
                    }

                    return (
                        <Component key={key} data={data} />
                    );
                })}
            </main>
        </>
    );
}

export default LayoutRenderer;
