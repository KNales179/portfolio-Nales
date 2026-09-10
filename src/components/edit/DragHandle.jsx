import { GripVertical } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";


// ============================================================
// DragHandle
// ============================================================
//
// The grab affordance for `useSortable`. Renders nothing on the
// public site. Spread `sortable.dragHandleProps(id)` onto it.
// ============================================================

function DragHandle({ className = "", ...props }) {
    const { editing } = useEditMode();

    if (!editing) {
        return null;
    }

    return (
        <span
            {...props}
            role="button"
            aria-label="Drag to reorder"
            title="Drag to reorder"
            className={`inline-flex h-6 w-6 cursor-grab items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)] active:cursor-grabbing ${className}`}
        >
            <GripVertical size={13} />
        </span>
    );
}

export default DragHandle;
