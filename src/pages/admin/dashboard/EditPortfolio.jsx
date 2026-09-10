import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MousePointerClick } from "lucide-react";

import { EditModeProvider } from "../../../context/EditModeContext";

import Home from "../../Home";
import Projects from "../../Projects";
import Certificates from "../../Certificates";
import About from "../../About";
import Contact from "../../Contact";


// ============================================================
// EDIT PORTFOLIO
// ============================================================
//
// The one and only editing surface for the public portfolio
// content. It lives under /admin/edit and is mounted behind
// <ProtectedRoute>, so only an authenticated admin can ever
// reach it.
//
// It renders the real public page components wrapped in
// <EditModeProvider>. That provider is what turns the shared
// <Editable> / <EditableTags> / collection controls "on" — on
// every public route there is NO provider, so the exact same
// components render as plain, read-only text for visitors.
//
// The backend is the real boundary: every content write
// endpoint is behind `protect` and rejects an unauthenticated
// request. Saves are immediately live and every change is
// written to the audit log.
// ============================================================

const SECTIONS = [
    { key: "home", label: "Home", Component: Home },
    { key: "projects", label: "Projects", Component: Projects },
    { key: "certificates", label: "Certificates", Component: Certificates },
    { key: "about", label: "About", Component: About },
    { key: "contact", label: "Contact", Component: Contact },
];


function EditPortfolio() {
    const [activeKey, setActiveKey] = useState("home");

    const active =
        SECTIONS.find((section) => section.key === activeKey) ||
        SECTIONS[0];

    const ActiveComponent = active.Component;

    return (
        <EditModeProvider>
            <div className="min-h-screen">

                {/* ==========================================
                    EDITING TOOLBAR
                    Sits just under the site navbar. This is the
                    only chrome added on top of the live page.
                ========================================== */}

                <div className="fixed inset-x-0 top-20 z-40 border-y border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 md:px-10 lg:px-16">

                        <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
                        >
                            <ArrowLeft size={15} />
                            Exit editing
                        </Link>

                        <span className="hidden h-4 w-px bg-[var(--border)] sm:block" />

                        <div className="flex flex-wrap gap-1">
                            {SECTIONS.map((section) => (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() =>
                                        setActiveKey(section.key)
                                    }
                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                                        section.key === activeKey
                                            ? "bg-purple-500/15 text-purple-400"
                                            : "text-[var(--text)]/70 hover:bg-purple-500/10 hover:text-[var(--text)]"
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>

                        <p className="ml-auto hidden items-center gap-1.5 text-xs text-[var(--muted)] lg:flex">
                            <MousePointerClick size={13} />
                            Double-click any text to edit — changes
                            save live
                        </p>

                    </div>
                </div>

                {/* ==========================================
                    LIVE, EDITABLE PAGE
                ========================================== */}

                <div className="pt-14">
                    <ActiveComponent />
                </div>

            </div>
        </EditModeProvider>
    );
}

export default EditPortfolio;
