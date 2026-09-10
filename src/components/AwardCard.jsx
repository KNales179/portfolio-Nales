import { motion } from "framer-motion";

import Editable from "./edit/Editable";
import EditableIcon from "./edit/EditableIcon";

function AwardCard({
  iconValue,
  iconEditable = false,
  title,
  category,
  description,
  index = 0,
  onSave,
}) {
  const save = (field) => (value) =>
    onSave ? onSave(field, value) : Promise.resolve();
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 45,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
      }}
      whileHover={{
        y: -8,
        scale: 1.01,
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-8 backdrop-blur-lg"
    >
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-purple-500/0 blur-3xl transition duration-300 group-hover:bg-purple-500/15" />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 transition duration-200 group-hover:rotate-6 group-hover:scale-110">
          <EditableIcon
            value={iconValue}
            onSave={
              iconEditable ? save("icon") : undefined
            }
            fallback="Award"
            size={27}
            iconClassName="text-purple-400"
          />
        </div>

        <Editable
          as="p"
          value={category}
          onSave={save("category")}
          placeholder="Category"
          className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-purple-400"
        />

        <Editable
          as="h3"
          value={title}
          onSave={save("title")}
          className="heading-font mb-4 block text-2xl font-bold"
        />

        <Editable
          as="p"
          value={description}
          onSave={save("description")}
          multiline
          placeholder="Description"
          className="block leading-7 opacity-70"
        />
      </div>
    </motion.article>
  );
}

export default AwardCard;