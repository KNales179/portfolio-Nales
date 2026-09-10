import SectionTitle from "../components/SectionTitle";
import AwardCard from "../components/AwardCard";

import { usePortfolioContent } from "../content/usePortfolioContent";
import DragHandle from "../components/edit/DragHandle";
import { useSortable } from "../components/edit/useSortable";
import {
  ArchiveButton,
  CollectionControls,
} from "../components/edit/CollectionControls";

const FALLBACK_AWARDS = [
  { id: "f1", icon: "Award", title: "Social Impact / Tech for Good Award", category: "Capstone Recognition", description: "" },
  { id: "f2", icon: "TrendingUp", title: "Most Improved Student", category: "BSIT Department", description: "" },
  { id: "f3", icon: "HeartHandshake", title: "Distinguished Departmental Service Award", category: "Service Recognition", description: "" },
  { id: "f4", icon: "Microscope", title: "DLL Research Congress Participation", category: "Research Participation", description: "" },
];

function Awards() {
  const {
    content,
    updateItem,
    archiveItem,
    restoreItem,
    reorderItems,
    createItem,
  } = usePortfolioContent();

  const hasAwards = content.awards.length > 0;
  const awards = hasAwards ? content.awards : FALLBACK_AWARDS;

  const sortable = useSortable(
    awards.map((award) => award.id),
    (orderedIds) => reorderItems("awards", orderedIds)
  );

  return (
    <div>
      <SectionTitle
        label="Recognition"
        title="Awards & Achievements"
        description="Recognition earned through project development, academic growth, departmental service, and research participation."
      />

      <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2">
        {awards.map((award, index) => (
          <div
            key={award.id || award.title}
            {...(hasAwards
              ? sortable.getItemProps(award.id)
              : {})}
            className={`relative h-full rounded-2xl transition ${
              sortable.overId === award.id
                ? "outline outline-2 outline-offset-2 outline-[var(--accent)]"
                : ""
            } ${
              sortable.draggingId === award.id
                ? "opacity-40"
                : ""
            }`}
          >
            <AwardCard
              iconValue={award.icon}
              iconEditable={hasAwards}
              title={award.title}
              category={award.category}
              description={award.description}
              index={index}
              onSave={(field, value) =>
                updateItem("awards", award.id, {
                  [field]: value,
                })
              }
            />
            <ArchiveButton
              label={award.title}
              onArchive={() =>
                archiveItem("awards", award.id)
              }
            />
            {hasAwards && (
              <DragHandle
                {...sortable.dragHandleProps(award.id)}
                className="absolute left-2 top-2 z-10"
              />
            )}
          </div>
        ))}
      </div>

      <CollectionControls
        type="awards"
        label="award"
        nameField="title"
        newItem={{
          title: "New award",
          category: "",
          description: "",
        }}
        onAdd={createItem}
        onRestore={restoreItem}
      />
    </div>
  );
}

export default Awards;