import { useRef, useState } from "react";
import { Check, FileUp, Loader2 } from "lucide-react";

import { usePortfolioContent } from "../../content/usePortfolioContent";
import { useEditMode } from "../../context/EditModeContext";


// ============================================================
// ResumeUploadControl
// ============================================================
//
// A small "replace the résumé" affordance shown next to every
// résumé download link while edit mode is on. Renders nothing
// on the public site.
//
//   <a href={resumeHref(content)} download>Download Résumé</a>
//   <ResumeUploadControl />
// ============================================================

const MAX_BYTES = 10 * 1024 * 1024;

function ResumeUploadControl({ className = "" }) {
    const { editing } = useEditMode();
    const { replaceResume } = usePortfolioContent();

    const inputRef = useRef(null);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    if (!editing) {
        return null;
    }

    const handleFile = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) {
            return;
        }

        if (file.type !== "application/pdf") {
            setStatus("error");
            setMessage("PDF files only.");
            return;
        }

        if (file.size > MAX_BYTES) {
            setStatus("error");
            setMessage("Keep it under 10 MB.");
            return;
        }

        setStatus("uploading");
        setMessage("");

        try {
            await replaceResume(file);
            setStatus("done");
            setMessage("Résumé replaced.");
            setTimeout(() => {
                setStatus("idle");
                setMessage("");
            }, 2500);
        } catch (error) {
            setStatus("error");
            setMessage(
                error?.message || "Upload failed. Try again."
            );
        }
    };

    return (
        <div
            className={`flex flex-wrap items-center gap-2 text-xs ${className}`}
        >
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={status === "uploading"}
                className="inline-flex items-center gap-1.5 border border-dashed border-[var(--accent)]/50 px-2.5 py-1 font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/5 disabled:opacity-60"
            >
                {status === "uploading" ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : status === "done" ? (
                    <Check size={12} />
                ) : (
                    <FileUp size={12} />
                )}
                {status === "uploading"
                    ? "Uploading…"
                    : "Replace résumé (PDF)"}
            </button>

            {message && (
                <span
                    className={
                        status === "error"
                            ? "text-red-400"
                            : "text-[var(--muted)]"
                    }
                >
                    {message}
                </span>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                className="hidden"
            />
        </div>
    );
}

export default ResumeUploadControl;
