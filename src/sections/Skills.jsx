import {
  Cloud,
  Code2,
  Database,
  Server,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import SkillCard from "../components/SkillCard";

const skills = [
  {
    title: "Frontend",
    icon: Code2,
    items: [
      "React",
      "React Native",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend",
    icon: Server,
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "API Integration",
      "Socket.IO",
    ],
  },
  {
    title: "Database",
    icon: Database,
    items: [
      "MongoDB",
      "Mongoose",
      "MySQL",
      "Database Design",
    ],
  },
  {
    title: "Security",
    icon: ShieldCheck,
    items: [
      "JWT Authentication",
      "Role-Based Authorization",
      "Password Hashing",
      "Input Validation",
      "Activity Logs",
      "Transaction Logs",
    ],
  },
  {
    title: "Tools & Cloud",
    icon: Cloud,
    items: [
      "Git",
      "GitHub",
      "Postman",
      "VS Code",
      "Render",
      "MongoDB Atlas",
      "Expo",
      "Cloudinary",
    ],
  },
  {
    title: "Learning Focus",
    icon: Wrench,
    items: [
      "System Design",
      "Mobile App Development",
      "Backend Architecture",
      "UI Improvement",
      "Problem Solving",
    ],
  },
];

function Skills() {
  return (
    <section
      id="skills"
      className="relative py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <SectionTitle
          label="Skills"
          title="Technologies & Tools"
          description="Technologies I use to plan, build, secure, and improve full-stack applications."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.title}
              title={skill.title}
              icon={skill.icon}
              items={skill.items}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;