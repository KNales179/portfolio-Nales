import { motion } from "framer-motion";

import SectionTitle from "../components/SectionTitle";

import { usePortfolioContent } from "../content/usePortfolioContent";
import Editable from "../components/edit/Editable";
import EditableIcon from "../components/edit/EditableIcon";
import DragHandle from "../components/edit/DragHandle";
import { useSortable } from "../components/edit/useSortable";
import {
  ArchiveButton,
  CollectionControls,
} from "../components/edit/CollectionControls";

const FALLBACK_STRENGTHS = [
  { id: "f1", icon: "BrainCircuit", title: "Logical Thinking", description: "" },
  { id: "f2", icon: "Lightbulb", title: "Feature Planning", description: "" },
  { id: "f3", icon: "Rocket", title: "Continuous Learning", description: "" },
];

function About() {
  const {
    content,
    updateItem,
    updateText,
    archiveItem,
    restoreItem,
    reorderItems,
    createItem,
  } = usePortfolioContent();

  const aboutText = content.text?.about || {};
  const hasStrengths = content.strengths.length > 0;
  const strengths = hasStrengths
    ? content.strengths
    : FALLBACK_STRENGTHS;

  const sortable = useSortable(
    strengths.map((strength) => strength.id),
    (orderedIds) => reorderItems("strengths", orderedIds)
  );

  return (
    <div>
      <SectionTitle
        label={aboutText.label || "About Me"}
        title={
          aboutText.title ||
          "Building practical systems through logic, planning, and continuous learning."
        }
        description={aboutText.description || ""}
        onSave={(field, value) =>
          updateText("about", { [field]: value })
        }
      />

      <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
        {strengths.map((strength, index) => {
          const save = (field) => (value) =>
            updateItem("strengths", strength.id, {
              [field]: value,
            });

          return (
            <motion.article
              key={strength.id || strength.title}
              {...(hasStrengths
                ? sortable.getItemProps(strength.id)
                : {})}
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
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -5,
              }}
              className={`group relative flex h-full flex-col rounded-2xl border bg-[var(--card)]/70 p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/10 ${
                sortable.overId === strength.id
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/40"
                  : "border-[var(--border)] hover:border-purple-400/30"
              } ${
                sortable.draggingId === strength.id
                  ? "opacity-40"
                  : ""
              }`}
            >
              <ArchiveButton
                label={strength.title}
                onArchive={() =>
                  archiveItem("strengths", strength.id)
                }
              />

              {hasStrengths && (
                <DragHandle
                  {...sortable.dragHandleProps(strength.id)}
                  className="absolute left-2 top-2 z-10"
                />
              )}

              <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-transform duration-300 group-hover:scale-105">
                <EditableIcon
                  value={strength.icon}
                  onSave={
                    hasStrengths ? save("icon") : undefined
                  }
                  fallback="Sparkles"
                  size={21}
                  iconClassName="text-purple-400"
                />
              </div>

              <Editable
                as="h3"
                value={strength.title}
                onSave={save("title")}
                className="heading-font block text-xl font-semibold"
              />

              <Editable
                as="p"
                value={strength.description}
                onSave={save("description")}
                multiline
                placeholder="Description"
                className="mt-3 block text-sm leading-7 text-[var(--muted)]"
              />
            </motion.article>
          );
        })}
      </div>

      <CollectionControls
        type="strengths"
        label="strength"
        nameField="title"
        newItem={{
          title: "New strength",
          description: "",
          icon: "Sparkles",
        }}
        onAdd={createItem}
        onRestore={restoreItem}
      />
    </div>
  );
}

export default About;