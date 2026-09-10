import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";

import { usePortfolioContent } from "../content/usePortfolioContent";
import Editable from "../components/edit/Editable";
import EditableIcon from "../components/edit/EditableIcon";
import EditableTags from "../components/edit/EditableTags";
import ReorderStrip from "../components/edit/ReorderStrip";
import {
  ArchiveButton,
  CollectionControls,
} from "../components/edit/CollectionControls";
import { useEditMode } from "../context/EditModeContext";

const tagPill = (skill) => (
  <span className="skill-pill shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-medium text-[var(--muted)]">
    {skill}
  </span>
);

const FALLBACK_SKILLS = [
  { id: "f1", name: "Languages", icon: "Code2", items: ["TypeScript", "JavaScript", "SQL", "Python"] },
  { id: "f2", name: "Frameworks", icon: "Layers", items: ["React", "React Native", "Node.js", "Express"] },
  { id: "f3", name: "Databases", icon: "Database", items: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"] },
  { id: "f4", name: "Tools", icon: "Wrench", items: ["Figma", "Git", "GitHub", "Tailwind CSS"] },
];

// Normalize a stored skill group to what the section renders.
const normalizeGroup = (group, index) => ({
  id: group.id,
  name: group.name,
  number: String(index + 1).padStart(2, "0"),
  icon: group.icon,
  skills: Array.isArray(group.items) ? group.items : [],
});

function SkillRow({
  group,
  index,
  onSaveName,
  onSaveItems,
  onSaveIcon,
  onArchive,
}) {
  const { editing } = useEditMode();

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
      <ArchiveButton
        label={group.name}
        onArchive={onArchive}
      />

      {/* Category */}
      <div className="relative z-20 flex w-[145px] shrink-0 items-center gap-3 bg-[var(--surface)] pr-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
          <EditableIcon
            value={group.icon}
            onSave={onSaveIcon}
            fallback="Code2"
            size={16}
            iconClassName="text-[var(--accent)]"
          />
        </div>

        <div>
          <p className="text-[9px] tracking-[0.16em] text-[var(--accent)]">
            {group.number}
          </p>

          <Editable
            as="p"
            value={group.name}
            onSave={onSaveName}
            className="heading-font block text-sm font-semibold whitespace-nowrap"
          />
        </div>
      </div>

      {/* Moving skills */}
      {editing ? (
        <div className="min-w-0 flex-1 px-3">
          <EditableTags
            value={group.skills}
            onSave={onSaveItems}
            renderTag={tagPill}
          />
        </div>
      ) : (
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
            animation: `skill-marquee ${18 + index * 3
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
      )}
    </motion.div>
  );
}

function MobileSkillGroup({
  group,
  index,
  onSaveName,
  onSaveItems,
  onSaveIcon,
  onArchive,
}) {
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
      className="relative border-b border-[var(--border)] py-5 last:border-b-0"
    >
      <ArchiveButton
        label={group.name}
        onArchive={onArchive}
      />

      {/* CATEGORY */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
          <EditableIcon
            value={group.icon}
            onSave={onSaveIcon}
            fallback="Code2"
            size={17}
            iconClassName="text-[var(--accent)]"
          />
        </div>

        <div>
          <p className="text-[9px] tracking-[0.16em] text-[var(--accent)]">
            {group.number}
          </p>

          <Editable
            as="h3"
            value={group.name}
            onSave={onSaveName}
            className="heading-font block text-sm font-semibold"
          />
        </div>
      </div>

      {/* SKILLS */}
      <EditableTags
        value={group.skills}
        onSave={onSaveItems}
        renderTag={(skill) => (
          <span className="border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
            {skill}
          </span>
        )}
      />
    </motion.div>
  );
}

function Skills() {
  const {
    content,
    updateItem,
    archiveItem,
    restoreItem,
    reorderItems,
    createItem,
  } = usePortfolioContent();

  const hasSkills = content.skills.length > 0;
  const source = hasSkills ? content.skills : FALLBACK_SKILLS;

  const groups = source.map(normalizeGroup);

  const saveName = (id) => (value) =>
    updateItem("skills", id, { name: value });

  const saveItems = (id) => (next) =>
    updateItem("skills", id, { items: next });

  const saveIcon = (id) => (value) =>
    updateItem("skills", id, { icon: value });

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
          {groups.map((group, index) => (
            <SkillRow
              key={group.id || group.name}
              group={group}
              index={index}
              onSaveName={saveName(group.id)}
              onSaveItems={saveItems(group.id)}
              onSaveIcon={
                hasSkills ? saveIcon(group.id) : undefined
              }
              onArchive={() =>
                archiveItem("skills", group.id)
              }
            />
          ))}
        </div>

        {/* MOBILE */}
        <div className="overflow-hidden border border-[var(--border)] bg-[var(--card)] px-5 backdrop-blur-md md:hidden">
          {groups.map((group, index) => (
            <MobileSkillGroup
              key={group.id || group.name}
              group={group}
              index={index}
              onSaveName={saveName(group.id)}
              onSaveItems={saveItems(group.id)}
              onSaveIcon={
                hasSkills ? saveIcon(group.id) : undefined
              }
              onArchive={() =>
                archiveItem("skills", group.id)
              }
            />
          ))}
        </div>

        {hasSkills && (
          <ReorderStrip
            title="Skill groups"
            items={groups}
            getLabel={(group) => group.name}
            onReorder={(orderedIds) =>
              reorderItems("skills", orderedIds)
            }
          />
        )}

        <CollectionControls
          type="skills"
          label="skill group"
          nameField="name"
          newItem={{
            name: "New group",
            icon: "Code2",
            items: [],
          }}
          onAdd={createItem}
          onRestore={restoreItem}
        />

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