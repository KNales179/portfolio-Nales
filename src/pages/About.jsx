import { motion } from "framer-motion";

import AboutSection from "../sections/About";
import Awards from "../sections/Awards";

const hobbies = [
  {
    title: "Learning & Experimenting with Code",
    description:
      "Learning new things, experimenting with code, and exploring different ways to build and solve problems.",
  },
  {
    title: "Gaming",
    description:
      "Playing games for fun, exploring different genres, and getting immersed in different worlds and experiences.",
  },
  {
    title: "Movies & Series",
    description:
      "Watching movies and series whenever I want to relax, discover new stories, or simply enjoy some downtime.",
  },
  {
    title: "Reading",
    description:
      "Reading whenever I find something interesting, from technical topics to stories and random subjects that catch my attention.",
  },
  {
    title: "Exploring New Technology",
    description:
      "Trying new tools, frameworks, libraries, and technologies that catch my interest.",
  },
  {
    title: "Building Side Projects",
    description:
      "Turning random ideas into small projects and experimenting with different ways to build them.",
  },
  {
    title: "Creative Experimentation",
    description:
      "Playing around with ideas, interfaces, animations, and different approaches to creating digital experiences.",
  },
];

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
            I'm a full stack developer who enjoys building functional systems,
            creating interactive experiences, and continuously exploring new
            ideas and technologies.
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
            ACADEMICS / AWARDS
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

            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
              A few things I enjoy when I'm away from development.
            </p>
          </div>

          {/* HOBBY GRID */}
          <div className="grid overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {hobbies.map((hobby, index) => (
              <motion.article
                key={hobby.title}
                initial={{
                  opacity: 0,
                  y: 20,
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
                  duration: 0.5,
                  delay: index * 0.06,
                }}
                className="group bg-[var(--card)] p-6 transition-colors duration-300 hover:bg-[var(--surface-soft)]"
              >
                {/* NUMBER */}
                <span className="text-xs font-medium tracking-[0.18em] text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* TITLE */}
                <h3 className="heading-font mt-4 text-lg font-semibold transition-colors duration-300 group-hover:text-[var(--accent)]">
                  {hobby.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {hobby.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

      </div>
    </section>
  );
}

export default About;