import { motion } from "framer-motion";

import AboutSection from "../sections/About";
import Awards from "../sections/Awards";

function About() {
  return (
    <section className="min-h-screen px-6 py-32 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1100px]">

        {/* =========================
            PAGE HEADER
        ========================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-4">
            <h1 className="heading-font text-4xl font-bold tracking-tight md:text-5xl">
              <span className="text-[var(--accent)]">#</span>{" "}
              About Me
            </h1>

            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
            I'm a passionate developer with a strong foundation in computer science and a keen interest in creating innovative solutions.
          </p>
        </motion.div>

        {/* =========================
            ABOUT
        ========================== */}
        <section className="mb-24">
          <div className="mb-8">
            <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[var(--accent)]">
              01
            </p>
          </div>

          <AboutSection />
        </section>

        {/* =========================
            ACADEMICS
        ========================== */}
        <section className="mb-24">
          <div className="mb-8">
            <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[var(--accent)]">
              02
            </p>
          </div>

          <Awards />
        </section>

        {/* =========================
            HOBBIES
        ========================== */}
        <section>
          <div className="mb-8">
            <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[var(--accent)]">
              03
            </p>

            <h2 className="heading-font text-3xl font-bold md:text-4xl">
              Hobbies
            </h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Personal interests and things I enjoy outside development.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
            <p className="text-sm leading-7 text-[var(--muted)]">
              Hobbies and personal interests will be added here.
            </p>
          </div>
        </section>

      </div>
    </section>
  );
}

export default About;