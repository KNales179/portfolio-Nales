import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Download,
} from "lucide-react";

function Hero() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 90]
  );

  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 35]
  );

  const photoOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [1, 0.2]
  );

  const goToProjects = () => {
    document
      .getElementById("projects")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const goToAbout = () => {
    document
      .getElementById("about")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="hero-heading"
      className="relative z-10 flex min-h-screen items-center overflow-hidden pt-20"
    >
            {/* =========================================
          SUBTLE IT / SYSTEM PARTICLES
      ========================================= */}

      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden="true"
      >
        {/* UI / Code block */}
        <motion.div
          className="absolute left-[8%] top-[18%] size-5 rounded-[4px] border border-[var(--accent)]/20"
          animate={{
            y: [0, 35, 0],
            rotate: [0, 12, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small system node */}
        <motion.div
          className="absolute left-[18%] top-[72%] size-2 rounded-full bg-[var(--accent)]/20"
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating transparent square */}
        <motion.div
          className="absolute right-[10%] top-[20%] size-8 rounded-md border border-[var(--accent)]/15"
          animate={{
            y: [0, 45, 0],
            rotate: [0, -15, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Tiny data node */}
        <motion.div
          className="absolute right-[25%] top-[78%] size-1.5 rounded-full bg-[var(--accent)]/30"
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.35, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small diamond / system marker */}
        <motion.div
          className="absolute right-[5%] top-[58%] size-3 rotate-45 border border-[var(--accent)]/15"
          animate={{
            y: [0, 28, 0],
            rotate: [45, 55, 45],
            opacity: [0.08, 0.22, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1440px] items-center px-6 md:px-10 lg:px-16">

        {/* =========================================
            HERO CONTENT
        ========================================= */}

        <motion.div
          className="relative z-20 w-full max-w-[850px] py-10"
          style={{ y: textY }}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* Introduction */}

          <motion.p
            className="mb-5 flex items-center gap-3 text-sm font-medium tracking-wide text-[var(--accent)] md:text-base"
            initial={{
              opacity: 0,
              x: -12,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.1,
              duration: 0.5,
            }}
          >
            <span
              className="h-px w-8 bg-[var(--accent)]"
              aria-hidden="true"
            />

            Hello, I'm
          </motion.p>

          {/* Name */}

          <h1
            id="hero-heading"
            className="heading-font mb-5 text-6xl font-bold leading-[0.95] tracking-[-0.04em] md:text-8xl lg:text-6xl"
          >
            Ivhel
          </h1>

          {/* Role */}

          <h2 className="heading-font mb-6 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.025em] md:text-4xl">
            Mobile & Full Stack Developer
          </h2>

          {/* Description */}

          <p className="mb-9 max-w-[820px] text-base leading-8 text-[var(--muted)] md:text-lg">
            I’m a developer who enjoys turning ideas into practical digital
            experiences. I’m always learning, experimenting with new technologies,
            and looking for better ways to build, solve problems, and create.
          </p>

          {/* =========================================
              ACTIONS
          ========================================= */}

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={goToProjects}
              className="group inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              View Projects

              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <a
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              download
              className="group inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-3 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Download Resume

              <Download
                size={18}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </a>

          </div>

        </motion.div>

        {/* =========================================
            PORTRAIT
        ========================================= */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[58vh] items-end justify-center opacity-[0.16] md:inset-auto md:right-[4%] md:top-1/2 md:h-[78vh] md:w-[35%] md:-translate-y-1/2 md:opacity-100">

          <motion.div
            className="relative h-full w-full"
            style={{
              y: photoY,
              opacity: photoOpacity,
            }}
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.85,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {/* Subtle circular anchor */}

            <div
              className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] md:h-[440px] md:w-[440px]"
              aria-hidden="true"
            />

            {/* Portrait */}

            <img
              src={`${import.meta.env.BASE_URL}beh.png`}
              alt="Ivhel, Mobile and Full Stack Developer"
              className="relative z-10 mx-auto h-full w-full -translate-y-[10%] object-contain object-center drop-shadow-2xl md:-translate-y-[10%]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 82%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 82%, transparent 100%)",
              }}
            />

          </motion.div>

        </div>

        {/* =========================================
            SCROLL INDICATOR
        ========================================= */}

        <motion.button
          type="button"
          aria-label="Scroll to About section"
          onClick={goToAbout}
          className="absolute bottom-7 left-1/2 z-30 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors duration-200 hover:border-[var(--accent)]/40 hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDown
            size={18}
            aria-hidden="true"
          />
        </motion.button>

      </div>
    </section>
  );
}

export default Hero;