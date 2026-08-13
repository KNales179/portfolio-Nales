import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import SectionTitle from "../components/SectionTitle";

const milestones = [
  {
    year: "2022",
    title: "Started Basic Coding",
    description:
      "Started college with no coding background and learned the fundamentals of programming through Python, including basic syntax, inputs, buttons, text display, and the classic “Hello World” program.",
  },
  {
    year: "2023",
    title: "Started Advanced Coding",
    description:
      "Moved from basic programming into more structured application development, learning how to build simple systems, understand logic flow, and create more functional user interfaces.",
  },
  {
    year: "2024",
    title: "Learned APIs, Backend, and Databases",
    description:
      "Expanded into backend development, API integration, authentication, database handling, and connecting frontend systems with server-side logic.",
  },
  {
    year: "2025",
    title: "Developed TODA-GO",
    description:
      "Built TODA-GO, a tricycle ride-hailing platform with passenger and driver mobile apps, backend services, location-based features, and a web-based admin dashboard.",
  },
  {
    year: "2026",
    title: "Completed Major Systems",
    description:
      "Completed TODA-GO and the Tricycle Integration Record System, presented the projects, participated in research activities, and graduated from the BSIT program.",
  },
];

/*
  Position of milestones on the map.

  These values correspond to the SVG viewBox.
*/
const points = [
  { x: 80, y: 150 },
  { x: 280, y: 75 },
  { x: 500, y: 175 },
  { x: 720, y: 80 },
  { x: 920, y: 150 },
];

/*
  The actual curved journey path.
*/
const PATH =
  "M 80 150 " +
  "C 145 150, 180 75, 280 75 " +
  "C 380 75, 400 175, 500 175 " +
  "C 600 175, 620 80, 720 80 " +
  "C 820 80, 840 150, 920 150";

function MobileJourney({ milestones, activeIndex, selectMilestone }) {
  return (
    <div className="relative mt-10 md:hidden">
      {/* Timeline line */}
      <div className="absolute bottom-0 left-[18px] top-0 w-px bg-[var(--border)]" />

      {/* Active progress */}
      <motion.div
        className="absolute left-[18px] top-0 w-px origin-top bg-[var(--accent)]"
        animate={{
          height: `${((activeIndex + 1) / milestones.length) * 100}%`,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <div className="space-y-8">
        {milestones.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.button
              key={item.year}
              type="button"
              onClick={() => selectMilestone(index)}
              initial={{
                opacity: 0,
                x: -20,
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
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="relative flex w-full items-start gap-5 text-left"
            >
              {/* DOT */}
              <div className="relative z-10 flex shrink-0 items-center justify-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.75,
                  }}
                  className={`size-9 border transition-all duration-300 ${isActive
                      ? "border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_20px_var(--accent-soft)]"
                      : "border-[var(--border)] bg-[var(--surface)]"
                    }`}
                >
                  <div
                    className={`mx-auto mt-[11px] size-2 rounded-full ${isActive
                        ? "bg-[var(--accent)]"
                        : "bg-[var(--muted)]"
                      }`}
                  />
                </motion.div>
              </div>

              {/* CONTENT */}
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0.6,
                }}
                className={`min-w-0 flex-1 border p-5 transition-all duration-300 ${isActive
                    ? "border-[var(--accent)]/30 bg-[var(--card)]"
                    : "border-[var(--border)] bg-[var(--card)]/50"
                  }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`text-xs font-bold tracking-[0.2em] ${isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--muted)]"
                      }`}
                  >
                    {item.year}
                  </span>

                  <span className="text-[10px] tracking-[0.15em] text-[var(--muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="heading-font mt-2 text-lg font-bold">
                  {item.title}
                </h3>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="mt-3 overflow-hidden text-sm leading-6 text-[var(--muted)]"
                    >
                      {item.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Journey() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /*
    Progress represents the dot's position along
    the entire journey.

    0   = 2022
    0.25 = between 2022/2023
    ...
    1   = 2026
  */
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const lastTimeRef = useRef(null);

  /*
    Automatically move the dot.
  */
  useEffect(() => {
    let animationFrame;

    const speed = 0.055;

    const animate = (time) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta =
        (time - lastTimeRef.current) / 1000;

      lastTimeRef.current = time;

      if (!isPaused) {
        let nextProgress =
          progressRef.current + delta * speed;

        /*
          Loop back to the beginning.
        */
        if (nextProgress >= 1) {
          nextProgress = 0;
        }

        progressRef.current = nextProgress;
        setProgress(nextProgress);

        /*
          Determine which milestone the dot
          currently belongs to.
        */
        const milestoneIndex = Math.min(
          Math.floor(nextProgress * milestones.length),
          milestones.length - 1,
        );

        setActiveIndex(milestoneIndex);
      }

      animationFrame =
        requestAnimationFrame(animate);
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () =>
      cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  /*
    Clicking a milestone moves the dot to it.
  */
  const selectMilestone = (index) => {
    const targetProgress =
      index / (milestones.length - 1);

    /*
      Keep the dot moving immediately toward
      the selected milestone.
    */
    progressRef.current = targetProgress;
    setProgress(targetProgress);
    setActiveIndex(index);
  };

  /*
    Convert progress into a percentage along
    the visual map.

    This is intentionally simple for the UI.
  */
  const getDotPosition = () => {
    /*
      Approximate the curved path using the
      milestone positions.

      This keeps the dot visually aligned
      with the map.
    */
    const scaled =
      progress * (points.length - 1);

    const segment = Math.min(
      Math.floor(scaled),
      points.length - 2,
    );

    const localProgress =
      scaled - segment;

    const start = points[segment];
    const end = points[segment + 1];

    return {
      x:
        start.x +
        (end.x - start.x) * localProgress,

      y:
        start.y +
        (end.y - start.y) * localProgress,
    };
  };

  const dot = getDotPosition();

  const activeMilestone =
    milestones[activeIndex];

  return (
    <section
      id="journey"
      className="relative overflow-hidden px-6 py-20 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1200px]">

        <SectionTitle
          label="Development Journey"
          title="My Path So Far"
          description="From writing my first lines of code to building complete systems."
        />

        {/* JOURNEY CONTAINER */}
        <div
          className="relative mt-12 hidden overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md md:block"
          onMouseEnter={() => {
            setIsPaused(true);
            lastTimeRef.current = null;
          }}
          onMouseLeave={() => {
            setIsPaused(false);
            lastTimeRef.current = null;
          }}
        >

          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/5 blur-[120px]"
            aria-hidden="true"
          />

          {/* MAP */}
          <div className="relative h-[330px] w-full md:h-[380px]">

            {/* SVG MAP */}
            <svg
              viewBox="0 0 1000 250"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >

              {/* Glow path */}
              <path
                d={PATH}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="10"
                strokeOpacity="0.06"
                strokeLinecap="round"
              />

              {/* Main path */}
              <motion.path
                d={PATH}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeOpacity="0.45"
                strokeLinecap="round"
                strokeDasharray="6 9"
                initial={{
                  pathLength: 0,
                }}
                whileInView={{
                  pathLength: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
            </svg>

            {/* MOVING DOT */}
            <motion.div
              className="pointer-events-none absolute z-20"
              animate={{
                left: `${dot.x / 10}%`,
                top: `${(dot.y / 250) * 100}%`,
              }}
              transition={{
                duration: 0.15,
                ease: "linear",
              }}
              style={{
                transform:
                  "translate(-50%, -50%)",
              }}
            >
              {/* Outer glow */}
              <motion.div
                className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/20 blur-md"
                animate={{
                  scale: isPaused
                    ? 1
                    : [1, 1.35, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                }}
              />

              {/* Dot */}
              <div className="relative size-3 rounded-full bg-[var(--accent)] shadow-[0_0_18px_var(--accent)]" />
            </motion.div>

            {/* MILESTONES */}
            {milestones.map((item, index) => {
              const point = points[index];

              const isActive =
                index === activeIndex;

              /*
                Put some years above and some below
                the path for a map-like appearance.
              */
              const yearAbove =
                index % 2 === 0;

              return (
                <motion.div
                  key={item.year}
                  className="absolute z-10"
                  style={{
                    left: `${point.x / 10}%`,
                    top: `${(point.y / 250) * 100}%`,
                    transform:
                      "translate(-50%, -50%)",
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      0.4 + index * 0.15,
                    duration: 0.45,
                  }}
                >

                  {/* Year */}
                  <motion.div
                    animate={{
                      opacity: isActive
                        ? 1
                        : 0.45,
                      y: isActive
                        ? yearAbove
                          ? -2
                          : 2
                        : 0,
                    }}
                    className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold tracking-[0.2em] ${yearAbove
                        ? "bottom-9"
                        : "top-9"
                      }`}
                  >
                    <span
                      className={
                        isActive
                          ? "text-[var(--accent)]"
                          : "text-[var(--muted)]"
                      }
                    >
                      {item.year}
                    </span>
                  </motion.div>

                  {/* Milestone button */}
                  <motion.button
                    type="button"
                    onClick={() =>
                      selectMilestone(index)
                    }
                    whileHover={{
                      scale: 1.2,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    className={`relative flex size-10 items-center justify-center rounded-full border transition-all duration-300 ${isActive
                        ? "border-[var(--accent)] bg-[var(--accent)]/20 shadow-[0_0_25px_var(--accent-soft)]"
                        : "border-[var(--border)] bg-[var(--surface)]/90 hover:border-[var(--accent)]"
                      }`}
                    aria-label={`View ${item.year} milestone`}
                  >
                    <MapPin
                      size={16}
                      className={
                        isActive
                          ? "text-[var(--accent)]"
                          : "text-[var(--muted)]"
                      }
                    />

                    {/* Active pulse */}
                    {isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-[var(--accent)]"
                        animate={{
                          scale: [1, 1.7],
                          opacity: [0.6, 0],
                        }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* DETAILS */}
          <div className="border-t border-[var(--border)]">

            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key={activeMilestone.year}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="px-6 py-6 md:px-10"
              >
                <div className="flex items-start gap-4">

                  {/* Number */}
                  <div className="hidden shrink-0 text-xs font-bold tracking-[0.2em] text-[var(--accent)] sm:block">
                    {String(
                      activeIndex + 1,
                    ).padStart(2, "0")}
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-[var(--accent)]">
                      {activeMilestone.year}
                    </p>

                    <h3 className="heading-font mt-1 text-xl font-bold md:text-2xl">
                      {activeMilestone.title}
                    </h3>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                      {
                        activeMilestone.description
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE JOURNEY */}
        <MobileJourney
          milestones={milestones}
          activeIndex={activeIndex}
          selectMilestone={selectMilestone}
        />
      </div>
    </section>
  );
}

export default Journey;