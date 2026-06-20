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
    [0, 140],
  );

  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 60],
  );

  const photoOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, 0.15],
  );

  const goToProjects = () => {
    document
      .getElementById("projects")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <motion.div
        className="absolute left-[8%] top-[20%] size-32 rounded-full border border-purple-400/10"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-[8%] top-[25%] size-16 rounded-2xl border border-purple-400/10"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1440px] items-center px-6 md:px-10 lg:px-16">
        <motion.div
          className="relative z-20 max-w-3xl py-20"
          style={{ y: textY }}
          initial={{
            opacity: 0,
            y: 45,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.p
            className="mb-5 flex items-center gap-3 text-base font-medium text-purple-400 md:text-lg"
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.6,
            }}
          >
            <span className="h-px w-10 bg-purple-400" />
            Hello, I&apos;m
          </motion.p>

          <h1
            className="heading-font mb-5 bg-clip-text text-6xl font-bold leading-none text-transparent md:text-8xl lg:text-9xl"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--text), #c084fc)",
            }}
          >
            Beh
          </h1>

          <h2 className="heading-font mb-6 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
            Mobile & Full Stack Developer
          </h2>

          <p className="mb-9 max-w-xl text-base leading-8 opacity-75 md:text-lg">
            I build mobile applications, backend systems,
            and administrative platforms focused on
            transportation and records management solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={goToProjects}
              className="group flex items-center gap-2 rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-950/20 transition duration-300 hover:-translate-y-1 hover:bg-purple-600 hover:shadow-purple-700/20"
            >
              View Projects

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <a
              href="/resume.pdf"
              download
              className="group flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 px-6 py-3 font-semibold backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-purple-400/60"
            >
              Resume

              <Download
                size={18}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 border-t border-[var(--border)] pt-7">
            <div>
              <p className="heading-font text-3xl font-bold">
                2+
              </p>
              <p className="text-sm opacity-60">
                Major systems
              </p>
            </div>

            <div>
              <p className="heading-font text-3xl font-bold">
                4+
              </p>
              <p className="text-sm opacity-60">
                Recognitions
              </p>
            </div>

            <div>
              <p className="heading-font text-3xl font-bold">
                1
              </p>
              <p className="text-sm opacity-60">
                Award-winning capstone
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-0 right-0 z-10 hidden h-[85vh] w-[65%] items-end justify-end md:flex"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="absolute bottom-[-15%] right-[10%] size-[600px] rounded-full bg-purple-600/20 blur-[140px]" />

          <img
            src="/beh.png"
            alt="Beh"
            className="relative z-10 h-full w-full object-contain object-bottom drop-shadow-2xl"
            onError={(event) => {
              console.error("Failed to load /beh.png");
              event.currentTarget.style.display = "none";
            }}
          />
        </motion.div>

        <motion.button
          type="button"
          aria-label="Scroll to About section"
          onClick={() => {
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-8 left-1/2 z-30 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md"
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDown size={20} />
        </motion.button>
      </div>
    </section>
  );
}

export default Hero;