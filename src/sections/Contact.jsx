import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  Mail,
} from "lucide-react";

const contacts = [
  {
    label: "Email",
    href: "mailto:your@email.com",
    icon: Mail,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/your-profile",
    icon: ExternalLink,
    external: true,
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    icon: Download,
    download: true,
  },
];

function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[75vh] items-center py-28"
    >
      <div className="mx-auto w-full max-w-5xl px-6 text-center md:px-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            filter: "blur(8px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/75 px-6 py-16 backdrop-blur-xl md:px-14 md:py-20"
        >
          <motion.div
            className="absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[100px]"
            animate={{
              x: ["-50%", "-42%", "-58%", "-50%"],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10">
            <p className="mb-4 font-medium text-purple-400">
              Contact
            </p>

            <h2 className="heading-font mx-auto mb-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Let&apos;s Build Something Great
            </h2>

            <p className="mx-auto mb-10 max-w-xl leading-7 opacity-70">
              Open to junior developer opportunities,
              collaborations, and professional connections.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
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
                    download={
                      contact.download
                        ? true
                        : undefined
                    }
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.08 + 0.25,
                    }}
                    whileHover={{
                      y: -5,
                      scale: 1.03,
                    }}
                    className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 px-5 py-3 font-medium transition hover:border-purple-400/60 hover:text-purple-400"
                  >
                    <Icon size={18} />
                    {contact.label}
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-sm opacity-50">
          © {new Date().getFullYear()} I-Bell (Ivhel).
          Built with React, Tailwind CSS, and curiosity.
        </p>
      </div>
    </section>
  );
}

export default Contact;