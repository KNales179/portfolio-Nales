import { useState } from "react";
import { Plus, X } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";
import Editable from "./Editable";


// ============================================================
// EditableParagraphs
// ============================================================
//
// A string[] of full paragraphs (a project's "learned",
// "challenges", ... notes lists).
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
//   ✕; an "add paragraph" button appends an empty one.
//   `onSave` always receives the whole new array.
// ============================================================

function EditableParagraphs({
    value = [],
    onSave,
    renderItem,
    className = "space-y-3",
}) {
    const { editing } = useEditMode();
    const [busy, setBusy] = useState(false);
    // Index of the paragraph just appended by "Add paragraph" —
    // it should open straight into edit mode instead of making
    // the visitor hunt for the double-click affordance on an
    // empty row.
    const [justAdded, setJustAdded] = useState(null);

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

    const add = async () => {
        const nextIndex = items.length;
        await commit([...items, ""]);
        setJustAdded(nextIndex);
    };

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
                        startActive={index === justAdded}
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

            <button
                type="button"
                onClick={add}
                disabled={busy}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]"
            >
                <Plus size={13} />
                Add paragraph
            </button>
        </div>
    );
}

export default EditableParagraphs;
