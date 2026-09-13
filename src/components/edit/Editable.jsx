import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";


// ============================================================
// Editable
// ============================================================
//
// Wraps a piece of display text. When edit mode is off it just
// renders the value. When on, it gets a dashed outline + pencil
// affordance; double-click (or tap) swaps in an input/textarea
// that matches the surrounding typography. Blur or Enter saves,
// Esc cancels.
//
//   <Editable
//       value={project.description}
//       onSave={(v) => updateField(project.id, "description", v)}
//       multiline
//       as="p"
//       className="text-sm leading-7 text-[var(--muted)]"
//   />
//
// `onSave` should perform the optimistic update; it may throw to
// signal a rejected save (the field then reverts + flags red).
// ============================================================

function Editable({
    value,
    onSave,
    as: Tag = "span",
    multiline = false,
    className = "",
    placeholder = "Empty",
    maxLength,
    // Open straight into the editor on mount — used for a field
    // just added by an "Add …" button, so the visitor never has
    // to hunt for the double-click affordance on an empty row.
    startActive = false,
}) {
    const { editing } = useEditMode();

    const [active, setActive] = useState(
        () => editing && startActive
    );
    const [draft, setDraft] = useState(value ?? "");
    const [saving, setSaving] = useState(false);
    const [showTick, setShowTick] = useState(false);
    const [failed, setFailed] = useState(false);

    const editorRef = useRef(null);
    const tickTimer = useRef(null);

    useEffect(
        () => () => clearTimeout(tickTimer.current),
        []
    );

    useEffect(() => {
        if (!active) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDraft(value ?? "");
        }
    }, [value, active]);

    useEffect(() => {
        if (active && editorRef.current) {
            editorRef.current.focus();
            editorRef.current.select?.();
            editorRef.current.scrollIntoView({
                block: "center",
                behavior: "smooth",
            });
        }
    }, [active]);

    // Grow a multiline editor to fit its content, but cap it so a
    // long edit scrolls inside the field instead of shoving the
    // rest of the page down.
    useEffect(() => {
        if (!active || !multiline || !editorRef.current) {
            return;
        }

        const el = editorRef.current;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
    }, [active, draft, multiline]);


    // --- not in edit mode: plain output --------------------

    if (!editing) {
        return (
            <Tag className={className}>{value}</Tag>
        );
    }


    // --- editing, editor open -----------------------------

    const commit = async () => {
        setActive(false);

        const nextValue = draft.trim();

        if (nextValue === (value ?? "").trim()) {
            return;
        }

        setSaving(true);
        setFailed(false);

        try {
            await onSave(nextValue);
            setShowTick(true);
            clearTimeout(tickTimer.current);
            tickTimer.current = setTimeout(
                () => setShowTick(false),
                1600
            );
        } catch {
            setDraft(value ?? "");
            setFailed(true);
        } finally {
            setSaving(false);
        }
    };

    if (active) {
        const Editor = multiline ? "textarea" : "input";

        return (
            <Editor
                ref={editorRef}
                value={draft}
                rows={multiline ? 2 : undefined}
                maxLength={maxLength}
                onChange={(event) =>
                    setDraft(event.target.value)
                }
                onBlur={commit}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        setDraft(value ?? "");
                        setActive(false);
                    }

                    if (
                        event.key === "Enter" &&
                        !multiline
                    ) {
                        event.preventDefault();
                        commit();
                    }
                }}
                className={`${className} block w-full ${
                    multiline
                        ? "max-h-80 resize-none overflow-y-auto"
                        : ""
                } rounded-[3px] border border-[var(--accent)] bg-[var(--surface)] px-1.5 py-0.5 outline-none`}
                style={{
                    font: "inherit",
                    color: "inherit",
                    lineHeight: "inherit",
                    letterSpacing: "inherit",
                }}
            />
        );
    }


    // --- editing, editor closed: affordance ---------------

    return (
        <Tag
            role="button"
            tabIndex={0}
            title="Double-click to edit"
            onDoubleClick={() => setActive(true)}
            onKeyDown={(event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    setActive(true);
                }
            }}
            className={`${className} relative cursor-text rounded-[3px] outline-dashed outline-1 outline-offset-2 transition-colors ${
                failed
                    ? "outline-red-500"
                    : "outline-[var(--accent)]/35 hover:outline-[var(--accent)] hover:bg-[var(--accent)]/5"
            }`}
        >
            {value || (
                <span className="italic opacity-40">
                    {placeholder}
                </span>
            )}

            {saving && (
                <Loader2
                    size={12}
                    className="ml-1 inline animate-spin align-middle text-[var(--accent)]"
                />
            )}

            {showTick && !saving && (
                <Check
                    size={12}
                    className="ml-1 inline align-middle text-green-500"
                />
            )}
        </Tag>
    );
}

export default Editable;
