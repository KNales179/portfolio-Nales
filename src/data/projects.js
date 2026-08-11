const projects = [
  {
    name: "TODA-GO Mobile",
    type: "Passenger & Driver Mobile Application",
    layout: "portrait",
    description:
      "A mobile transportation application built for passengers and tricycle drivers, supporting ride booking, location-based services, and ride management.",
    technologies: [
      "React Native",
      "Expo",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "OpenRouteService",
    ],
    image: `${import.meta.env.BASE_URL}projects/TodaGo.jpg`,
    status: "complete",
  },

  {
    name: "TODA-GO Admin",
    type: "Web-Based Administration Platform",
    layout: "landscape",
    description:
      "The web administration platform supporting the TODA-GO system, providing tools for managing users, drivers, records, and transportation operations.",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "MapTiler",
    ],
    image: `${import.meta.env.BASE_URL}projects/TodaGoAdmin.jpg`,
    status: "complete",
  },

  {
    name: "TIRS",
    type: "Tricycle Integrated Records System",
    layout: "landscape",
    description:
      "A records and transaction management system designed to organize driver, vehicle, franchise, violation, impoundment, and transaction records.",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Cloudinary",
    ],
    image: `${import.meta.env.BASE_URL}projects/TIRS.jpg`,
    status: "incomplete",
  },

  {
    name: "FareCheck Lucena",
    type: "Offline Mobile Fare Calculator",
    layout: "portrait",
    description:
      "An offline mobile application for calculating tricycle fares within Lucena City using local route data, offline maps, and an official fare matrix.",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "MapLibre",
      "GraphHopper",
      "AsyncStorage",
      "Node.js",
      "MongoDB",
      "NativeWind",
    ],
    image: `${import.meta.env.BASE_URL}projects/FareCheck.jpg`,
    status: "complete",
  },

  {
    name: "Personal Portfolio",
    type: "Interactive Developer Portfolio",
    layout: "landscape",
    description:
      "A personal portfolio designed to showcase my projects, skills, experience, and development work through an interactive and responsive web experience.",
    technologies: [
      "React",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    image: `${import.meta.env.BASE_URL}projects/PortfolioL.jpg`,
    status: "incomplete",
  },
];

export default projects;