import { useRef } from "react";
import { ImageUp, Loader2 } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";
import { useImageUpload } from "./useImageUpload";


// ============================================================
// EditableImage
// ============================================================
//
// Wraps an <img> (or placeholder). On the public site it just
// renders its children. In edit mode it lays a "Replace image"
// overlay over them; picking a file uploads it to Cloudinary and
// calls `onUpload(secureUrl)` with the new URL (the caller does
// the optimistic field update).
//
//   <EditableImage
//       uploadType="PROJECT_IMAGE"
//       onUpload={(url) => updateField(id, "image", url)}
//       className="absolute inset-0"
//   >
//       <img src={project.image} className="h-full w-full object-cover" />
//   </EditableImage>
//
// `className` must establish a positioning context (it usually
// fills an existing `relative` frame with `absolute inset-0`);
// the replace overlay is positioned against it.
// ============================================================

function EditableImage({
    children,
    onUpload,
    uploadType = "OTHER",
    className = "",
}) {
    const { editing } = useEditMode();
    const { upload, busy, error } = useImageUpload(uploadType);

    const inputRef = useRef(null);

    if (!editing) {
        return children;
    }

    const handleFile = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        const url = await upload(file);

        if (url && onUpload) {
            await onUpload(url);
        }
    };

    return (
        <div className={`group/img ${className}`}>
            {children}

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1 bg-black/55 text-xs font-semibold text-white opacity-0 outline-dashed outline-1 -outline-offset-2 outline-[var(--accent)]/60 transition group-hover/img:opacity-100 disabled:opacity-100"
            >
                {busy ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <ImageUp size={18} />
                )}
                {busy ? "Uploading…" : "Replace image"}
                {error && (
                    <span className="max-w-[80%] text-center text-red-300">
                        {error}
                    </span>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
            />
        </div>
    );
}

export default EditableImage;
