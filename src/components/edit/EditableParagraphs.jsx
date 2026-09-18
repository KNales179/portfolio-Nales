import { useState } from "react";
import { Plus, X } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";
import Editable from "./Editable";


// ============================================================
// EditableParagraphs
// ============================================================
//
// A string[] of full paragraphs (a project's "learned",
// "challenges", ... notes lists; also reused by
// EditableManuscriptSections for a description block's texts).
//
//   <EditableParagraphs
//     value={notes.learned}
//     onSave={(next) => onEditFields({
//       notes: { ...notes, learned: next },
//     })}
//     renderItem={(text) => <li className="...">{text}</li>}
//   />
//
// - edit mode off: renders each paragraph via `renderItem`
// - edit mode on:  each paragraph is a multiline editor with a
//   ✕; an "add paragraph" button appends one.
//
// "Add paragraph" opens a DRAFT slot that is purely local state —
// it is NOT sent to the server until it actually has content.
// Earlier this saved an empty string immediately, and the
// backend's sanitizer strips empty strings out of the array on
// every save (`.filter(Boolean)`) — so the optimistic blank row
// would round-trip and vanish the moment the save response came
// back ("the input opens then closes"). Deferring the save until
// there's real text avoids ever writing (and having stripped) an
// empty entry.
// ============================================================

function EditableParagraphs({
    value = [],
    onSave,
    renderItem,
    className = "space-y-3",
}) {
    const { editing } = useEditMode();
    const [busy, setBusy] = useState(false);
    // Local-only draft slot rendered after the saved items, not
    // yet part of `value`.
    const [drafting, setDrafting] = useState(false);

    const items = Array.isArray(value) ? value : [];

    if (!editing) {
        return (
            <ul className={className}>
                {items.map((text, index) => (
                    <span key={index}>
                        {renderItem(text, index)}
                    </span>
                ))}
            </ul>
        );
    }

    const commit = async (next) => {
        setBusy(true);
        try {
            await onSave(next);
        } catch {
            // onSave owns rollback
        } finally {
            setBusy(false);
        }
    };

    const setAt = (index, text) => {
        const next = items.slice();
        next[index] = text;
        return commit(next);
    };

    const removeAt = (index) =>
        commit(items.filter((_, i) => i !== index));

    // The draft slot's own Editable calls this on blur/Enter.
    // Empty input (abandoned draft) is just discarded locally —
    // nothing is ever saved for it.
    const commitDraft = (text) => {
        setDrafting(false);
        const trimmed = text.trim();
        if (!trimmed) {
            return Promise.resolve();
        }
        return commit([...items, trimmed]);
    };

    const add = () => setDrafting(true);

    return (
        <div className={className}>
            {items.map((text, index) => (
                <div
                    key={index}
                    className="flex items-start gap-2"
                >
                    <Editable
                        as="p"
                        value={text}
                        onSave={(next) =>
                            setAt(index, next)
                        }
                        multiline
                        placeholder="Paragraph"
                        className="flex-1 border-l-2 border-[var(--border)] pl-4 text-sm leading-7 text-[var(--muted)]"
                    />
                    <button
                        type="button"
                        onClick={() => removeAt(index)}
                        disabled={busy}
                        aria-label="Remove paragraph"
                        className="mt-1 text-[var(--muted)] hover:text-red-400"
                    >
                        <X size={13} />
                    </button>
                </div>
            ))}

            {drafting && (
                <div className="flex items-start gap-2">
                    <Editable
                        as="p"
                        value=""
                        onSave={commitDraft}
                        multiline
                        placeholder="Paragraph"
                        startActive
                        className="flex-1 border-l-2 border-[var(--border)] pl-4 text-sm leading-7 text-[var(--muted)]"
                    />
                    <button
                        type="button"
                        onClick={() => setDrafting(false)}
                        aria-label="Discard paragraph"
                        className="mt-1 text-[var(--muted)] hover:text-red-400"
                    >
                        <X size={13} />
                    </button>
                </div>
            )}

            {!drafting && (
                <button
                    type="button"
                    onClick={add}
                    disabled={busy}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]"
                >
                    <Plus size={13} />
                    Add paragraph
                </button>
            )}
        </div>
    );
}

export default EditableParagraphs;
