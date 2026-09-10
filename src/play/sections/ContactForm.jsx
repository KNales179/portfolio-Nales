import { useState } from "react";
import { Send } from "lucide-react";

import { sendContactMessage } from "../../services/contactApi";
import { trackInteraction } from "../../analytics/track";


// ============================================================
// PLAY CONTACT FORM
// ============================================================
//
// One preset-token-styled message form, shared by every
// contact surface. Same backend as the main site.
// ============================================================

const EMPTY = {
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "", // honeypot — real users never fill this
};

const fieldStyle = {
    borderColor: "var(--play-border)",
    background: "var(--play-surface)",
    borderRadius: "var(--play-radius)",
};

function ContactForm() {
    const [form, setForm] = useState(EMPTY);
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState({
        type: "",
        message: "",
    });

    const set = (key) => (event) =>
        setForm((current) => ({
            ...current,
            [key]: event.target.value,
        }));

    const submit = async (event) => {
        event.preventDefault();
        setSending(true);
        setStatus({ type: "", message: "" });

        try {
            await sendContactMessage(form);
            trackInteraction(
                "CONTACT_FORM_SUBMITTED",
                "play"
            );
            setForm(EMPTY);
            setStatus({
                type: "success",
                message:
                    "Message sent — I'll get back to you soon.",
            });
        } catch (error) {
            setStatus({
                type: "error",
                message:
                    error?.message ||
                    "Something went wrong. Try again.",
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <input
                type="text"
                name="company"
                value={form.company}
                onChange={set("company")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Name"
                    className="w-full border px-4 py-3 text-sm outline-none"
                    style={fieldStyle}
                />
                <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Email"
                    className="w-full border px-4 py-3 text-sm outline-none"
                    style={fieldStyle}
                />
            </div>

            <input
                required
                value={form.subject}
                onChange={set("subject")}
                placeholder="Subject"
                className="w-full border px-4 py-3 text-sm outline-none"
                style={fieldStyle}
            />

            <textarea
                required
                rows={5}
                value={form.message}
                onChange={set("message")}
                placeholder="Your message"
                className="w-full resize-none border px-4 py-3 text-sm leading-6 outline-none"
                style={fieldStyle}
            />

            {status.message && (
                <p
                    className="text-sm"
                    style={{
                        color:
                            status.type === "error"
                                ? "#ef4444"
                                : "var(--play-accent)",
                    }}
                >
                    {status.message}
                </p>
            )}

            <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
                style={{
                    background: "var(--play-accent)",
                    color: "var(--play-accent-contrast)",
                    borderRadius: "var(--play-radius)",
                }}
            >
                {sending ? "Sending…" : "Send message"}
                <Send size={15} />
            </button>
        </form>
    );
}

export default ContactForm;
