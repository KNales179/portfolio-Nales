import { motion } from "framer-motion";

import AboutSection from "../sections/About";
import Awards from "../sections/Awards";

import { usePortfolioContent } from "../content/usePortfolioContent";
import Editable from "../components/edit/Editable";
import DragHandle from "../components/edit/DragHandle";
import { useSortable } from "../components/edit/useSortable";
import {
  ArchiveButton,
  CollectionControls,
} from "../components/edit/CollectionControls";

function About() {
  const {
    content,
    updateItem,
    archiveItem,
    restoreItem,
    reorderItems,
    createItem,
  } = usePortfolioContent();
  const hobbies = content.hobbies;

  const sortable = useSortable(
    hobbies.map((hobby) => hobby.id),
    (orderedIds) => reorderItems("hobbies", orderedIds)
  );

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
                key={hobby.id || hobby.title}
                {...sortable.getItemProps(hobby.id)}
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
                className={`group relative bg-[var(--card)] p-6 transition-colors duration-300 hover:bg-[var(--surface-soft)] ${
                  sortable.overId === hobby.id
                    ? "outline outline-2 -outline-offset-2 outline-[var(--accent)]"
                    : ""
                } ${
                  sortable.draggingId === hobby.id
                    ? "opacity-40"
                    : ""
                }`}
              >
                <ArchiveButton
                  label={hobby.title}
                  onArchive={() =>
                    archiveItem("hobbies", hobby.id)
                  }
                />

                <DragHandle
                  {...sortable.dragHandleProps(hobby.id)}
                  className="absolute left-2 top-2 z-10"
                />

                {/* NUMBER */}
                <span className="text-xs font-medium tracking-[0.18em] text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* TITLE */}
                <Editable
                  as="h3"
                  value={hobby.title}
                  onSave={(v) =>
                    updateItem("hobbies", hobby.id, {
                      title: v,
                    })
                  }
                  className="heading-font mt-4 block text-lg font-semibold transition-colors duration-300 group-hover:text-[var(--accent)]"
                />

                {/* DESCRIPTION */}
                <Editable
                  as="p"
                  value={hobby.description}
                  onSave={(v) =>
                    updateItem("hobbies", hobby.id, {
                      description: v,
                    })
                  }
                  multiline
                  placeholder="Description"
                  className="mt-2 block text-sm leading-6 text-[var(--muted)]"
                />
              </motion.article>
            ))}
          </div>

          <CollectionControls
            type="hobbies"
            label="hobby"
            nameField="title"
            newItem={{ title: "New hobby", description: "" }}
            onAdd={createItem}
            onRestore={restoreItem}
          />
        </section>

      </div>
    </section>
  );
}

export default About;