import { useEffect, useState } from "react";
import { ArchiveRestore, Plus, Trash2 } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";
import { fetchContentAll } from "../../services/contentApi";


// ============================================================
// ArchiveButton
// ============================================================
//
// A small "archive this item" affordance, shown per card in
// edit mode. Archiving is a soft delete — restorable below.
// ============================================================

export function ArchiveButton({ label, onArchive }) {
    const { editing } = useEditMode();
    const [busy, setBusy] = useState(false);

    if (!editing) {
        return null;
    }

    return (
        <button
            type="button"
            disabled={busy}
            onClick={async () => {
                if (
                    !window.confirm(
                        `Archive "${label}"? You can restore it below.`
                    )
                ) {
                    return;
                }
                setBusy(true);
                try {
                    await onArchive();
                } finally {
                    setBusy(false);
                }
            }}
            className="absolute right-2 top-2 z-10 flex items-center gap-1 border border-red-500/40 bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-red-400 disabled:opacity-50"
        >
            <Trash2 size={11} />
            Archive
        </button>
    );
}


// ============================================================
// CollectionControls
// ============================================================
//
// Per-section footer (edit mode only): an "Add" button and an
// "Archived (N)" restore strip for one content collection.
//
//   <CollectionControls
//     type="hobbies"
//     contentKey="hobbies"          // key in the /api/content payload
//     newItem={{ title: "New hobby", description: "" }}
//     label="hobby"
//     nameField="title"
//     onAdd={createItem}
//     onRestore={restoreItem}
//   />
// ============================================================

export function CollectionControls({
    type,
    newItem,
    label,
    nameField = "title",
    onAdd,
    onRestore,
}) {
    const { editing } = useEditMode();
    const [archived, setArchived] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!editing || loaded) {
            return;
        }

        let cancelled = false;

        fetchContentAll(type)
            .then((rows) => {
                if (!cancelled) {
                    setArchived(
                        rows.filter((row) => row.archivedAt)
                    );
                }
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) {
                    setLoaded(true);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [editing, loaded, type]);

    if (!editing) {
        return null;
    }

    return (
        <div className="mt-6">
            <button
                type="button"
                onClick={() => onAdd(type, newItem)}
                className="flex items-center gap-2 border border-dashed border-[var(--accent)]/50 px-4 py-2 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/5"
            >
                <Plus size={15} />
                Add {label}
            </button>

            {archived.length > 0 && (
                <div className="mt-4 border-t border-dashed border-[var(--border)] pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Archived ({archived.length})
                    </p>
                    <div className="mt-2 space-y-1.5">
                        {archived.map((row) => (
                            <div
                                key={row.id}
                                className="flex items-center justify-between gap-3 border border-[var(--border)] px-3 py-2 text-sm"
                            >
                                <span>
                                    {row[nameField] ||
                                        "Untitled"}
                                </span>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await onRestore(
                                            type,
                                            row.id
                                        );
                                        setArchived(
                                            (list) =>
                                                list.filter(
                                                    (r) =>
                                                        r.id !==
                                                        row.id
                                                )
                                        );
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]"
                                >
                                    <ArchiveRestore
                                        size={13}
                                    />
                                    Restore
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
