import { useRef, useState } from "react";


// ============================================================
// useSortable
// ============================================================
//
// Minimal drag-to-reorder on top of the native HTML5 drag API —
// no dependency. A dedicated drag handle is the draggable
// element; every item is a drop zone. Dropping onto an item
// moves the dragged item to that position and calls
// `onReorder(nextIds)` with the full new id order.
//
//   const ids = items.map((i) => i.id);
//   const sort = useSortable(ids, (next) =>
//       reorderItems("hobbies", next)
//   );
//   ...
//   <li
//       {...sort.getItemProps(item.id)}
//       className={sort.overId === item.id ? "ring-2 ..." : ""}
//   >
//       <DragHandle {...sort.dragHandleProps(item.id)} />
//   </li>
// ============================================================

export function useSortable(ids, onReorder) {
    const dragId = useRef(null);
    const [draggingId, setDraggingId] = useState(null);
    const [overId, setOverId] = useState(null);

    const dragHandleProps = (id) => ({
        draggable: true,
        onDragStart: (event) => {
            // Keep a parent <a>/<article> from also starting a
            // native drag of its own.
            event.stopPropagation();
            dragId.current = id;
            setDraggingId(id);
            event.dataTransfer.effectAllowed = "move";
            try {
                event.dataTransfer.setData("text/plain", id);
            } catch {
                // Safari can throw here — the ref is the source of truth.
            }
        },
        onDragEnd: () => {
            dragId.current = null;
            setDraggingId(null);
            setOverId(null);
        },
    });

    const getItemProps = (id) => ({
        onDragOver: (event) => {
            if (!dragId.current || dragId.current === id) {
                return;
            }
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
            setOverId((current) =>
                current === id ? current : id
            );
        },
        onDragLeave: () => {
            setOverId((current) =>
                current === id ? null : current
            );
        },
        onDrop: (event) => {
            event.preventDefault();

            const from = dragId.current;
            setOverId(null);

            if (!from || from === id) {
                return;
            }

            const next = ids.slice();
            const fromIndex = next.indexOf(from);
            const toIndex = next.indexOf(id);

            if (fromIndex === -1 || toIndex === -1) {
                return;
            }

            next.splice(
                toIndex,
                0,
                next.splice(fromIndex, 1)[0]
            );

            onReorder(next);
        },
    });

    return { dragHandleProps, getItemProps, draggingId, overId };
}
