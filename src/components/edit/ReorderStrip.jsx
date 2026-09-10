import { GripVertical } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";
import { useSortable } from "./useSortable";


// ============================================================
// ReorderStrip
// ============================================================
//
// A compact "drag to reorder" list shown only in edit mode.
// Used for sections whose public layout can't host inline drag
// handles (the skills marquee, the journey map). Card grids use
// <DragHandle> on the card itself instead.
//
//   <ReorderStrip
//       items={milestones}
//       getLabel={(m) => `${m.year} — ${m.title}`}
//       onReorder={(ids) => reorderItems("journey", ids)}
//   />
// ============================================================

function ReorderStrip({
    items,
    getLabel,
    onReorder,
    title = "Order",
}) {
    const { editing } = useEditMode();

    const sortable = useSortable(
        items.map((item) => item.id),
        onReorder
    );

    if (!editing || items.length < 2) {
        return null;
    }

    return (
        <div className="mt-6 border border-dashed border-[var(--border)] p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {title} — drag to reorder
            </p>

            <ul className="space-y-1">
                {items.map((item) => (
                    <li
                        key={item.id}
                        {...sortable.getItemProps(item.id)}
                        className={`flex items-center gap-2 border bg-[var(--surface)] px-2 py-1.5 text-sm transition ${
                            sortable.overId === item.id
                                ? "border-[var(--accent)]"
                                : "border-[var(--border)]"
                        } ${
                            sortable.draggingId === item.id
                                ? "opacity-40"
                                : ""
                        }`}
                    >
                        <span
                            {...sortable.dragHandleProps(item.id)}
                            className="cursor-grab text-[var(--muted)] active:cursor-grabbing"
                            aria-label="Drag to reorder"
                        >
                            <GripVertical size={13} />
                        </span>

                        <span className="truncate">
                            {getLabel(item)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReorderStrip;
