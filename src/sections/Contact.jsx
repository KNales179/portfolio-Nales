import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import SectionTitle from "../components/SectionTitle";
import { sendContactMessage } from "../services/contactApi";
import { trackInteraction, trackLink } from "../analytics/track";
import { usePortfolioContent } from "../content/usePortfolioContent";
import { resumeHref } from "../content/siteAssets";
import Editable from "../components/edit/Editable";
import EditableIcon from "../components/edit/EditableIcon";
import ResumeUploadControl from "../components/edit/ResumeUploadControl";
import DragHandle from "../components/edit/DragHandle";
import { useSortable } from "../components/edit/useSortable";
import { useEditMode } from "../context/EditModeContext";

const FALLBACK_CONTACTS = [
  { id: "f1", label: "Email", href: "mailto:ibelldev179@gmail.com", icon: "Mail" },
  { id: "f2", label: "LinkedIn", href: "https://www.linkedin.com/in/ivhel-nales-996189419", icon: "FaLinkedin", external: true },
];

function Contact() {
  const { editing } = useEditMode();
  const { content, updateItem, reorderItems } =
    usePortfolioContent();

  const hasContacts = content.contactLinks.length > 0;

  const contacts = [
    ...(hasContacts ? content.contactLinks : FALLBACK_CONTACTS),
    {
      id: "resume",
      label: "Resume",
      href: resumeHref(content),
      icon: "Download",
      download: true,
    },
  ];

  const sortable = useSortable(
    (hasContacts ? content.contactLinks : []).map(
      (contact) => contact.id
    ),
    (orderedIds) => reorderItems("contact-links", orderedIds)
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "", // honeypot — real users never fill this
  });

  const [sending, setSending] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      await sendContactMessage(formData);

      trackInteraction("CONTACT_FORM_SUBMITTED", "home-contact");

      setStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus({
        type: "error",
        message:
          error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-[1100px]">

        {/* Heading */}
        <SectionTitle
          label="Contact"
          title="Let's Connect"
          description="Have a project, opportunity, or idea in mind? Feel free to reach out."
        />

        {/* Main contact area */}
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

          {/* ==============================
              LEFT — CONTACT INFORMATION
             ============================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 md:p-8"
          >
            {/* Background glow */}
            <motion.div
              className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-[var(--accent)]/10 blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative">
              <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[var(--accent)]">
                GET IN TOUCH
              </p>

              <h3 className="heading-font text-2xl font-bold md:text-3xl">
                Let&apos;s Build
                <br />
                Something Great.
              </h3>

              <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--muted)]">
                Open to junior developer opportunities,
                collaborations, freelance projects, and
                professional connections.
              </p>

              {/* Contact links */}
              <div className="mt-8 space-y-2">
                {contacts.map((contact, index) => {
                  const sortableItem =
                    hasContacts && !contact.download;

                  return (
                    <motion.a
                      key={contact.id || contact.label}
                      {...(sortableItem
                        ? sortable.getItemProps(contact.id)
                        : {})}
                      href={contact.href}
                      onClick={(event) => {
                        if (editing && !contact.download) {
                          event.preventDefault();
                          return;
                        }
                        if (contact.download) {
                          trackInteraction(
                            "RESUME_DOWNLOAD",
                            "home-contact"
                          );
                        } else {
                          trackLink(
                            contact.href,
                            contact.label
                          );
                        }
                      }}
                      target={
                        contact.external
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        contact.external
                          ? "noreferrer"
                          : undefined
                      }
                      download={
                        contact.download
                          ? true
                          : undefined
                      }
                      initial={{
                        opacity: 0,
                        x: -15,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.07 + 0.2,
                      }}
                      whileHover={{
                        x: 5,
                      }}
                      className={`group relative flex items-center justify-between rounded-xl border bg-[var(--surface)]/50 px-4 py-3 transition-colors duration-300 hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)] ${
                        sortableItem &&
                        sortable.overId === contact.id
                          ? "border-[var(--accent)]"
                          : "border-[var(--border)]"
                      } ${
                        sortableItem &&
                        sortable.draggingId === contact.id
                          ? "opacity-40"
                          : ""
                      }`}
                    >
                      {sortableItem && (
                        <DragHandle
                          {...sortable.dragHandleProps(
                            contact.id
                          )}
                          className="absolute -left-2 -top-2 z-20 shadow-sm"
                        />
                      )}

                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
                          <EditableIcon
                            value={contact.icon}
                            onSave={
                              sortableItem
                                ? (v) =>
                                    updateItem(
                                      "contact-links",
                                      contact.id,
                                      { icon: v }
                                    )
                                : undefined
                            }
                            fallback="Link"
                            size={16}
                            iconClassName="text-[var(--accent)]"
                          />
                        </div>

                        {contact.download ? (
                          <span className="text-sm font-medium">
                            {contact.label}
                          </span>
                        ) : (
                          <Editable
                            value={contact.label}
                            onSave={(v) =>
                              updateItem(
                                "contact-links",
                                contact.id,
                                { label: v }
                              )
                            }
                            className="text-sm font-medium"
                          />
                        )}
                      </div>

                      <ExternalLink
                        size={14}
                        className="text-[var(--muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                      />
                    </motion.a>
                  );
                })}

                <ResumeUploadControl className="pt-1" />
              </div>
            </div>
          </motion.div>

          {/* ==============================
              RIGHT — CONTACT FORM
             ============================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 md:p-8"
          >
            <div className="mb-7">
              <p className="text-xs font-medium tracking-[0.2em] text-[var(--accent)]">
                SEND A MESSAGE
              </p>

              <h3 className="heading-font mt-2 text-2xl font-bold">
                Tell me about it.
              </h3>
            </div>

            {/* No backend yet — visual form only */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Honeypot — hidden from real users, catches bots */}
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company: e.target.value,
                  })
                }
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-xs font-medium text-[var(--muted)]"
                  >
                    Name
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-[var(--muted)] focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-xs font-medium text-[var(--muted)]"
                  >
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-[var(--muted)] focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/10"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-xs font-medium text-[var(--muted)]"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="What would you like to talk about?"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subject: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-[var(--muted)] focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/10"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-xs font-medium text-[var(--muted)]"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  placeholder="Tell me about your project, idea, or opportunity..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                    })
                  }
                  required
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 outline-none transition-all duration-300 placeholder:text-[var(--muted)] focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/10"
                />
              </div>

              {status.message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${status.type === "success"
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                >
                  {status.message}
                </div>
              )}

              {/* Send button */}
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
              >
                {sending ? "Sending..." : "Send Message"}

                <Send
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>

            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-[var(--border)] pt-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            {/* Brand */}
            <div className="flex items-center gap-4 text-left">
              <div className="group shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}IBell.png`}
                  alt="I-Bell logo"
                  className="h-11 w-11 rounded-xl object-cover shadow-md shadow-purple-950/20 transition duration-300 group-hover:scale-105"
                />
              </div>

              <div>
                <a
                  href="mailto:ibelldev179@gmail.com"
                  className="font-medium transition-colors hover:text-purple-400"
                >
                  Ivhel
                </a>

                <p className="text-sm text-[var(--muted)]">
                  ibelldev179@gmail.com
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Full-stack developer specializing in back-end development
                </p>
              </div>
            </div>

            {/* Media */}
            <div className="text-left md:text-right">
              <p className="mb-3 text-xs font-medium tracking-[0.18em] text-purple-400">
                MEDIA
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/KNales179"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 transition hover:-translate-y-1 hover:border-purple-400/60 hover:text-purple-400"
                >
                  <FaGithub size={18} />
                </a>

                <a
                  href="https://www.linkedin.com/in/ivhel-nales-996189419"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 transition hover:-translate-y-1 hover:border-purple-400/60 hover:text-purple-400"
                >
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-10 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} Ivhel Nales
            </span>

            <span>
              I-Bell · Built with React
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}

export default Contact;