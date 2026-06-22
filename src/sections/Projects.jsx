import {
  Database,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    name: "TODA-GO",
    type: "Mobile and Web Transportation Platform",
    description:
      "TODA-GO is a tricycle ride-hailing platform designed to support local transportation through passenger and driver mobile applications, backend services, location-based booking, and a web-based admin dashboard.",
    technologies: [
      "React Native",
      "Expo",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "OpenRouteService",
      "MapTiler",
      "Render",
    ],
    features: [
      {
        icon: Smartphone,
        label: "Passenger & Driver Apps",
      },
      {
        icon: MapPinned,
        label: "Location-Based Booking",
      },
      {
        icon: LayoutDashboard,
        label: "Web Admin Dashboard",
      },
      {
        icon: ShieldCheck,
        label: "Authentication & RBAC",
      },
    ],
    image: `${import.meta.env.BASE_URL}projects/todago-preview.png`,
  },
  {
    name: "Tricycle Integration Record System",
    type: "Records and Transaction Management System",
    description:
      "TIRS is a records management system built to organize driver, enforcer, staff, vehicle, violation, franchise, impoundment, and transaction records.",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MySQL",
      "XAMPP",
    ],
    features: [
      {
        icon: Users,
        label: "Driver & Staff Profiles",
      },
      {
        icon: Database,
        label: "Vehicle Records",
      },
      {
        icon: ShieldCheck,
        label: "Violation Tracking",
      },
      {
        icon: LayoutDashboard,
        label: "Transaction Logs",
      },
    ],
    image: `${import.meta.env.BASE_URL}projects/tirs-preview.png`,
  },
];

function Projects() {
  const handleViewCaseStudy = (project) => {
    console.log("View case study:", project.name);
  };

  return (
    <section
      id="projects"
      className="relative py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <SectionTitle
          label="Featured Projects"
          title="Systems I Built"
          description="These projects show how I apply full-stack development, system planning, backend logic, and real-world problem solving."
        />

        <div className="mt-16 space-y-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              onViewCaseStudy={handleViewCaseStudy}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;