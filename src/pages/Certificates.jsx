import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";

const certificates = [
  {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco",
    badgeId: "1684af74-8fc0-4df3-8d9e-37d20b80b174",
    image: `${import.meta.env.BASE_URL}certificates/Cybersecurity_intro.png`,
  },
  {
    title: "Ethical Hacker",
    issuer: "Cisco",
    badgeId: "f1498d56-a6c0-4009-954f-d8fea6586fd1",
    image: `${import.meta.env.BASE_URL}certificates/Ethical_hacker.png`,
  },
  {
    title: "Networking Basics",
    issuer: "Cisco",
    badgeId: "453b327a-9810-4a01-b85f-e1ffc5c6ae60",
    image: `${import.meta.env.BASE_URL}certificates/Networking_basics.png`,
  },
];

function Certificates() {
  return (
    <section className="relative min-h-screen py-28 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="heading-font text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-[var(--accent)]">#</span>{" "}
            Certificates
          </h1>
          <div className="flex items-center gap-4">

            <div className="h-px w-10 bg-purple-500/40" />

            <span className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Credentials
            </span>
          </div>




          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Certifications and credentials earned through technical
            training, continuous learning, and professional development.
          </p>
        </div>

        {/* CERTIFICATE GRID */}
        <div className="grid gap-6 md:grid-cols-3">
          {certificates.map((certificate, index) => (
            <motion.article
              key={certificate.badgeId}
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
              className="group overflow-hidden border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl"
            >
              {/* CERTIFICATE IMAGE */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
                <img
                  src={certificate.image}
                  alt={`${certificate.title} certificate`}
                  className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                />

                {/* Image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              </div>

              {/* INFO */}
              <div className="border-t border-[var(--border)] p-5">
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <Award
                        size={15}
                        className="shrink-0 text-purple-400"
                      />

                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-400">
                        {certificate.issuer}
                      </span>
                    </div>

                    <h2 className="heading-font text-lg font-semibold leading-snug">
                      {certificate.title}
                    </h2>
                  </div>

                  {/* VERIFY */}
                  <a
                    href={`https://www.credly.com/badges/${certificate.badgeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${certificate.title}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--muted)] transition duration-300 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-400"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>

                <div className="mt-4 text-xs text-[var(--muted)]">
                  Verified credential
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Certificates;