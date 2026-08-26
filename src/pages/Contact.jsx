import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  ExternalLink,
  Download,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
} from "react-icons/fa";
import { sendContactMessage } from "../services/contactApi";

const contacts = [
  {
    label: "Email",
    value: "ibelldev179@gmail.com",
    href: "mailto:ibelldev179@gmail.com",
    icon: Mail,
  },
  {
    label: "Facebook",
    value: "Connect with me",
    href: "https://www.facebook.com/lehvi.ben",
    icon: FaFacebook,
    external: true,
  },
  {
    label: "Instagram",
    value: "Follow me",
    href: "https://www.instagram.com/levi.cohen179?igsi=MWdjMmZrNTJzNXJrdQ==",
    icon: FaInstagram,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "Professional profile",
    href: "https://www.linkedin.com/in/ivhel-nales-996189419",
    icon: FaLinkedin,
    external: true,
  },
  {
    label: "WhatsApp",
    value: "Chat with me",
    href: "https://api.whatsapp.com/send?phone=639635321913",
    icon: FaWhatsapp,
    external: true,
  }
];

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
      await sendContactEmail(formData);

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
    <section className="relative min-h-screen px-6 pb-20 pt-32 md:px-10 md:pt-40 lg:px-16">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            PAGE INTRO
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            CONTACT
          </p>

          <h1 className="heading-font text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Let's build something
            <span className="block text-[var(--accent)]">
              together.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">
            Whether you have a project idea, an opportunity,
            a collaboration, or simply want to connect,
            feel free to reach out.
          </p>
        </motion.div>


        {/* =========================
            MAIN CONTACT AREA
        ========================== */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

          {/* =========================
              CONTACT INFORMATION
          ========================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/80 p-7 backdrop-blur-xl md:p-9"
          >

            {/* Background glow */}
            <motion.div
              className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[var(--accent)]/10 blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                GET IN TOUCH
              </p>

              <h2 className="heading-font mt-3 text-3xl font-bold">
                Contact Information
              </h2>

              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                You can reach me through any of the platforms
                below. I am always open to new opportunities,
                collaborations, and interesting projects.
              </p>


              {/* Contact links */}
              <div className="mt-8 space-y-3">
                {contacts.map((contact, index) => {
                  const Icon = contact.icon;

                  return (
                    <motion.a
                      key={contact.label}
                      href={contact.href}
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
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                      }}
                      whileHover={{
                        x: 5,
                      }}
                      className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4 transition-all duration-300 hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]"
                    >
                      <div className="flex items-center gap-4">

                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                          <Icon size={19} />
                        </div>

                        <div>
                          <p className="text-xs text-[var(--muted)]">
                            {contact.label}
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {contact.value}
                          </p>
                        </div>

                      </div>

                      <ExternalLink
                        size={15}
                        className="text-[var(--muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                      />
                    </motion.a>
                  );
                })}
              </div>


              {/* Resume */}
              <a
                href={`${import.meta.env.BASE_URL}Nales_Ivhel_Resume.pdf`}
                download
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-5 py-3 text-sm font-semibold transition-all duration-300 hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]"
              >
                <Download size={17} />

                Download Resume
              </a>

            </div>
          </motion.div>


          {/* =========================
              MESSAGE FORM
          ========================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/80 p-7 backdrop-blur-xl md:p-9"
          >

            <div className="mb-8">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                SEND A MESSAGE
              </p>

              <h2 className="heading-font mt-3 text-3xl font-bold">
                Tell me about it.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Have something in mind? Send me a message
                and let's start a conversation.
              </p>

            </div>


            <form onSubmit={handleSubmit} className="space-y-5">

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
                    name="name"
                    type="text"
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
                    name="email"
                    type="email"
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
                  name="subject"
                  type="text"
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
                  rows={8}
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

              {/* Submit */}
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
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>

            </form>

          </motion.div>

        </div>


        {/* =========================
            AVAILABILITY
        ========================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mt-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 p-7 text-center backdrop-blur-xl md:p-9"
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Mail size={22} />
          </div>

          <h2 className="heading-font mt-5 text-2xl font-bold">
            Open to opportunities
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            I am open to junior developer opportunities,
            collaborations, freelance work, and projects where
            I can contribute and continue growing as a developer.
          </p>
        </motion.div>


        {/* =========================
            FOOTER
        ========================== */}
        <footer className="mt-20 border-t border-[var(--border)] pt-10">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            {/* Brand */}
            <div className="flex items-center gap-4">

              <img
                src={`${import.meta.env.BASE_URL}IBell.png`}
                alt="I-Bell logo"
                className="h-11 w-11 rounded-xl object-cover shadow-md shadow-purple-950/20"
              />

              <div>
                <p className="font-semibold">
                  Ivhel
                </p>

                <p className="text-sm text-[var(--muted)]">
                  ibelldev179@gmail.com
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Full-stack developer specializing in
                  back-end development
                </p>
              </div>

            </div>


            {/* Socials */}
            <div className="text-left md:text-right">

              <p className="mb-3 text-xs font-medium tracking-[0.18em] text-[var(--accent)]">
                SOCIALS
              </p>

              <div className="flex items-center gap-3">

                <a
                  href="https://github.com/KNales179"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 transition hover:-translate-y-1 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
                >
                  <FaGithub size={18} />
                </a>

                <a
                  href="https://www.linkedin.com/in/ivhel-nales-996189419"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 transition hover:-translate-y-1 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
                >
                  <FaLinkedin size={18} />
                </a>

              </div>

            </div>

          </div>


          {/* <div className="mt-10 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">

            <span>
              © {new Date().getFullYear()} Ivhel Nales
            </span>

            <span>
              I-Bell · Built with React
            </span>

          </div> */}

        </footer>

      </div>
    </section>
  );
}

export default Contact;