import { useState } from "react";
import { Plus, X } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";


// ============================================================
// EditableTags
// ============================================================
//
// A string[] field (skill tags, a project's technologies).
//
//   <EditableTags
//     value={group.skills}
//     onSave={(next) => updateItem("skills", id, { items: next })}
//     renderTag={(tag) => <span className="...">{tag}</span>}
//   />
//
// - edit mode off: just renders each tag via `renderTag`
// - edit mode on:  each tag gets an ✕, plus an "add" input.
//   `onSave` receives the whole new array; it should apply the
//   optimistic update and may throw to signal a rejected save.
// ============================================================

function EditableTags({
    value = [],
    onSave,
    renderTag,
    className = "flex flex-wrap gap-2",
}) {
    const { editing } = useEditMode();
    const [draft, setDraft] = useState("");
    const [busy, setBusy] = useState(false);

    const tags = Array.isArray(value) ? value : [];

    if (!editing) {
        return (
            <div className={className}>
                {tags.map((tag, index) => (
                    <span key={`${tag}-${index}`}>
                        {renderTag(tag)}
                    </span>
                ))}
            </div>
        );
    }

    const commit = async (next) => {
        setBusy(true);
        try {
            await onSave(next);
        } catch {
            // onSave is responsible for rollback.
        } finally {
            setBusy(false);
        }
    };

    const addTag = () => {
        const clean = draft.trim();
        if (!clean || tags.includes(clean)) {
            setDraft("");
            return;
        }
        setDraft("");
        commit([...tags, clean]);
    };

    const removeAt = (index) => {
        commit(tags.filter((_, i) => i !== index));
    };

    return (
        <div
            className={`${className} rounded-[3px] outline-dashed outline-1 outline-offset-4 outline-[var(--accent)]/35`}
        >
            {tags.map((tag, index) => (
                <span
                    key={`${tag}-${index}`}
                    className="relative inline-flex items-center"
                >
                    {renderTag(tag)}
                    <button
                        type="button"
                        onClick={() => removeAt(index)}
                        disabled={busy}
                        aria-label={`Remove ${tag}`}
                        className="ml-1 text-[var(--muted)] hover:text-red-400"
                    >
                        <X size={12} />
                    </button>
                </span>
            ))}

            <span className="inline-flex items-center gap-1">
                <input
                    value={draft}
                    onChange={(event) =>
                        setDraft(event.target.value)
                    }
                    onKeyDown={(event) => {
                        if (
                            event.key === "Enter" ||
                            event.key === ","
                        ) {
                            event.preventDefault();
                            addTag();
                        }
                    }}
                    onBlur={addTag}
                    placeholder="add…"
                    className="w-20 border border-[var(--accent)] bg-[var(--surface)] px-1.5 py-0.5 text-xs outline-none"
                />
                <button
                    type="button"
                    onClick={addTag}
                    disabled={busy}
                    aria-label="Add tag"
                    className="text-[var(--accent)]"
                >
                    <Plus size={13} />
                </button>
            </span>
        </div>
    );
}

export default EditableTags;
