import {
  Award,
  HeartHandshake,
  Microscope,
  TrendingUp,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import AwardCard from "../components/AwardCard";

const awards = [
  {
    icon: Award,
    title: "Social Impact / Tech for Good Award",
    category: "Capstone Recognition",
    description:
      "Awarded to TODA-GO for focusing on community transportation improvement and real-world social value.",
  },
  {
    icon: TrendingUp,
    title: "Most Improved Student",
    category: "BSIT Department",
    description:
      "Recognition from the BSIT Department for significant academic, technical, and personal growth.",
  },
  {
    icon: HeartHandshake,
    title: "Distinguished Departmental Service Award",
    category: "Service Recognition",
    description:
      "Recognition for exceptional service, dedication, and contribution to the department.",
  },
  {
    icon: Microscope,
    title: "DLL Research Congress Participation",
    category: "Research Participation",
    description:
      "Certificate of participation for presenting and representing technical research during the DLL Research Congress.",
  },
];

function Awards() {
  return (
    <section
      id="awards"
      className="relative py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <SectionTitle
          label="Recognition"
          title="Awards & Achievements"
          description="Recognition earned through project development, academic growth, departmental service, and research participation."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {awards.map((award, index) => (
            <AwardCard
              key={award.title}
              icon={award.icon}
              title={award.title}
              category={award.category}
              description={award.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Awards;