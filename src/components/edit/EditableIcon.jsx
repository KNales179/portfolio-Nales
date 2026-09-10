import { createElement, useEffect, useRef, useState } from "react";
import { Check, ExternalLink, Loader2, X } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";
import { resolveIcon, isIconUrl, NAMED_ICONS } from "./iconMap";


// Render a stored icon value — a known name or an image URL.
function IconGlyph({ value, fallback, size, className }) {
    if (isIconUrl(value)) {
        return (
            <img
                src={value}
                alt=""
                width={size}
                height={size}
                loading="lazy"
                className={className}
                style={{
                    display: "inline-block",
                    objectFit: "contain",
                }}
                onError={(event) => {
                    event.currentTarget.style.visibility =
                        "hidden";
                }}
            />
        );
    }

    // resolveIcon returns a stable component reference from a
    // fixed map — createElement keeps the lint rule about
    // render-created components happy.
    return createElement(
        resolveIcon(value, resolveIcon(fallback)),
        { size, className }
    );
}


// ============================================================
// EditableIcon
// ============================================================
//
// Public: renders the resolved icon, nothing else.
// Edit mode: the icon becomes a button that opens a small
// picker — a grid of the built-in icons plus a field for an
// image URL (the URL is verified to actually load as an image
// before it's saved). A "Browse icons" link opens a reference
// gallery in a new tab.
//
//   <EditableIcon
//       value={award.icon}
//       fallback="Award"
//       size={21}
//       iconClassName="text-purple-400"
//       onSave={(icon) => updateItem("awards", award.id, { icon })}
//   />
// ============================================================

const BROWSE_URL = "https://lucide.dev/icons/";
const VERIFY_TIMEOUT = 8000;

const verifyImage = (url) =>
    new Promise((resolve) => {
        const image = new Image();
        let settled = false;

        const done = (ok) => {
            if (!settled) {
                settled = true;
                resolve(ok);
            }
        };

        image.onload = () => done(image.naturalWidth > 0);
        image.onerror = () => done(false);
        image.src = url;

        setTimeout(() => done(false), VERIFY_TIMEOUT);
    });


function EditableIcon({
    value,
    onSave,
    fallback = "Sparkles",
    size = 20,
    wrapperClassName = "",
    iconClassName = "",
}) {
    const { editing } = useEditMode();

    const [open, setOpen] = useState(false);
    const [urlDraft, setUrlDraft] = useState("");
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState({
        type: "",
        message: "",
    });

    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onPointerDown = (event) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", onPointerDown);
        return () =>
            document.removeEventListener(
                "mousedown",
                onPointerDown
            );
    }, [open]);

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUrlDraft(isIconUrl(value) ? value : "");
            setStatus({ type: "", message: "" });
        }
    }, [open, value]);

    const glyph = (
        <IconGlyph
            value={value}
            fallback={fallback}
            size={size}
            className={iconClassName}
        />
    );

    if (!editing || !onSave) {
        return (
            <span className={wrapperClassName}>{glyph}</span>
        );
    }

    const commit = async (next) => {
        setBusy(true);
        try {
            await onSave(next);
            setOpen(false);
            setStatus({ type: "", message: "" });
        } catch {
            setStatus({
                type: "error",
                message: "Could not save.",
            });
        } finally {
            setBusy(false);
        }
    };

    const applyUrl = async () => {
        const url = urlDraft.trim();

        if (!url) {
            return;
        }

        if (!/^https?:\/\//i.test(url)) {
            setStatus({
                type: "error",
                message: "Enter a full https:// link.",
            });
            return;
        }

        setBusy(true);
        setStatus({ type: "info", message: "Checking link…" });

        const ok = await verifyImage(url);

        if (!ok) {
            setBusy(false);
            setStatus({
                type: "error",
                message:
                    "That link didn't load as an image.",
            });
            return;
        }

        await commit(url);
    };

    return (
        <span
            ref={rootRef}
            className={`relative inline-flex ${wrapperClassName}`}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                title="Change icon"
                className="rounded-[3px] outline-dashed outline-1 outline-offset-2 outline-[var(--accent)]/40 transition hover:outline-[var(--accent)]"
            >
                {glyph}
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-2 w-64 border border-[var(--border)] bg-[var(--card)] p-3 text-left shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                            Icon
                        </p>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-[var(--muted)] hover:text-[var(--text)]"
                        >
                            <X size={13} />
                        </button>
                    </div>

                    <div className="mt-2 grid grid-cols-6 gap-1">
                        {NAMED_ICONS.map((name) => {
                            const active = value === name;

                            return (
                                <button
                                    key={name}
                                    type="button"
                                    disabled={busy}
                                    onClick={() => commit(name)}
                                    title={name}
                                    className={`flex aspect-square items-center justify-center border transition ${
                                        active
                                            ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                                            : "border-[var(--border)] hover:bg-[var(--surface)]"
                                    }`}
                                >
                                    {createElement(
                                        resolveIcon(name),
                                        { size: 14 }
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                            Or an image link
                        </label>
                        <div className="mt-1 flex gap-1">
                            <input
                                value={urlDraft}
                                onChange={(event) =>
                                    setUrlDraft(
                                        event.target.value
                                    )
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        applyUrl();
                                    }
                                }}
                                placeholder="https://…/icon.svg"
                                className="min-w-0 flex-1 border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs outline-none"
                            />
                            <button
                                type="button"
                                onClick={applyUrl}
                                disabled={busy}
                                aria-label="Use this link"
                                className="flex items-center border border-[var(--accent)] px-2 text-[var(--accent)] disabled:opacity-50"
                            >
                                {busy ? (
                                    <Loader2
                                        size={12}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Check size={12} />
                                )}
                            </button>
                        </div>
                    </div>

                    {status.message && (
                        <p
                            className={`mt-2 text-[11px] ${
                                status.type === "error"
                                    ? "text-red-400"
                                    : "text-[var(--muted)]"
                            }`}
                        >
                            {status.message}
                        </p>
                    )}

                    <a
                        href={BROWSE_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--accent)]"
                    >
                        <ExternalLink size={11} />
                        Browse icons
                    </a>
                </div>
            )}
        </span>
    );
}

export default EditableIcon;
