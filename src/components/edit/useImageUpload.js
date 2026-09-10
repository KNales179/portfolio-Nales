import { useCallback, useState } from "react";

import { uploadImageAsset } from "../../services/contentApi";


// ============================================================
// useImageUpload
// ============================================================
//
// Shared client-side validation + Cloudinary upload for the
// inline image editors. Returns the secure URL (or null on a
// rejected / failed upload, with `error` set).
//
//   const { upload, busy, error } = useImageUpload("PROJECT_IMAGE");
//   const url = await upload(file);
// ============================================================

const MAX_BYTES = 5 * 1024 * 1024;

export function useImageUpload(uploadType = "OTHER") {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const upload = useCallback(
        async (file) => {
            if (!file) {
                return null;
            }

            if (!file.type.startsWith("image/")) {
                setError("Images only.");
                return null;
            }

            if (file.size > MAX_BYTES) {
                setError("Max 5 MB.");
                return null;
            }

            setBusy(true);
            setError("");

            try {
                return await uploadImageAsset(file, uploadType);
            } catch (uploadError) {
                setError(
                    uploadError?.message ||
                        "Upload failed. Try again."
                );
                return null;
            } finally {
                setBusy(false);
            }
        },
        [uploadType]
    );

    return { upload, busy, error, setError };
}
