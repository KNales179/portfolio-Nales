import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Layers,
  Wrench,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";

const skillGroups = [
  {
    number: "01",
    name: "Languages",
    icon: Code2,
    skills: [
      "TypeScript",
      "JavaScript",
      "SQL",
      "Python",
    ],
  },
  {
    number: "02",
    name: "Frameworks",
    icon: Layers,
    skills: [
      "React",
      "React Native",
      "Node.js",
      "Express",
      "Vite",
      "Expo",
      "NativeWind",
      "Django",
    ],
  },
  {
    number: "03",
    name: "Databases",
    icon: Database,
    skills: [
      "MongoDB",
      "MySQL",
      "MongoDB Atlas",
      "AsyncStorage",
      "SQLite",
      "PostgreSQL",
    ],
  },
  {
    number: "04",
    name: "Tools",
    icon: Wrench,
    skills: [
      "Figma",
      "Git",
      "GitHub",
      "Tailwind CSS",
      "MapLibre",
      "GraphHopper",
      "OpenStreetMap",
      "Cloudinary",
      "Render",
    ],
  },
];

function SkillRow({ group, index }) {
  /*
   * Duplicate the skills so the second copy follows
   * the first one seamlessly.
   */
  const repeatedSkills = [
    ...group.skills,
    ...group.skills,
    ...group.skills,
  ];

  return (
    <motion.div
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
        amount: 0.3,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      className="group relative flex h-16 items-center overflow-hidden border-b border-[var(--border)] last:border-b-0"
    >
      {/* Category */}
      <div className="relative z-20 flex w-[145px] shrink-0 items-center gap-3 bg-[var(--surface)] pr-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
          <group.icon
            size={16}
            strokeWidth={1.8}
            className="text-[var(--accent)]"
          />
        </div>

        <div>
          <p className="text-[9px] tracking-[0.16em] text-[var(--accent)]">
            {group.number}
          </p>

          <p className="heading-font text-sm font-semibold whitespace-nowrap">
            {group.name}
          </p>
        </div>
      </div>

      {/* Moving skills */}
      <div
        className="relative min-w-0 flex-1 overflow-hidden"
        onMouseEnter={(event) => {
          event.currentTarget
            .querySelector(".skill-track")
            ?.classList.add("paused");
        }}
        onMouseLeave={(event) => {
          event.currentTarget
            .querySelector(".skill-track")
            ?.classList.remove("paused");
        }}
      >
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[var(--surface)] to-transparent"
          aria-hidden="true"
        />

        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[var(--surface)] to-transparent"
          aria-hidden="true"
        />

        <div
          className="skill-track flex w-max items-center gap-3"
          style={{
            animation: `skill-marquee ${
              18 + index * 3
            }s linear infinite`,
            animationDirection:
              index % 2 === 0 ? "normal" : "reverse",
          }}
        >
          {repeatedSkills.map((skill, skillIndex) => (
            <button
              key={`${skill}-${skillIndex}`}
              type="button"
              className="skill-pill group/pill shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-medium text-[var(--muted)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
              onClick={() => {
                const element =
                  document.getElementById(
                    `skill-${group.number}-${skill
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}`,
                  );

                element?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MobileSkillGroup({ group, index }) {
  const Icon = group.icon;

  return (
    <motion.div
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
        delay: index * 0.08,
      }}
      className="border-b border-[var(--border)] py-5 last:border-b-0"
    >
      {/* CATEGORY */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
          <Icon
            size={17}
            strokeWidth={1.8}
            className="text-[var(--accent)]"
          />
        </div>

        <div>
          <p className="text-[9px] tracking-[0.16em] text-[var(--accent)]">
            {group.number}
          </p>

          <h3 className="heading-font text-sm font-semibold">
            {group.name}
          </h3>
        </div>
      </div>

      {/* SKILLS */}
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden px-6 py-24 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Heading */}
        <SectionTitle
          label="Skills"
          title="What I Work With"
          description="Technologies and tools I've learned and used while building applications and systems."
        />

        {/* DESKTOP */}
        <div className="hidden overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 backdrop-blur-md md:block">
          {skillGroups.map((group, index) => (
            <SkillRow
              key={group.name}
              group={group}
              index={index}
            />
          ))}
        </div>

        {/* MOBILE */}
        <div className="overflow-hidden border border-[var(--border)] bg-[var(--card)] px-5 backdrop-blur-md md:hidden">
          {skillGroups.map((group, index) => (
            <MobileSkillGroup
              key={group.name}
              group={group}
              index={index}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.4,
            duration: 0.5,
          }}
          className="mt-8 flex items-center justify-center gap-3 text-xs tracking-[0.2em] text-[var(--muted)]"
        >
          <span className="size-1.5 rounded-full bg-[var(--accent)]" />
          ALWAYS LEARNING
          <span className="size-1.5 rounded-full bg-[var(--accent)]" />
        </motion.div>
      </div>

      {/* Marquee animation */}
      <style>{`
        @keyframes skill-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-33.333%);
          }
        }

        .skill-track.paused {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}

export default Skills;