const projects = [
  {
    name: "TODA-GO Mobile",
    type: "Passenger & Driver Mobile Application",
    layout: "portrait",
    github: "https://github.com/KNales179/toda-go-frontend2",
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
    github: "https://github.com/KNales179/TODAGO-Admin",
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
    github: "https://github.com/KNales179/TIRS-Frontend",
    demoLink: "https://youtu.be/hs3MF7IALmQ",
    description:
      "A records and transaction management system designed to organize driver, vehicle, franchise, violation, impoundment, and transaction records.",
    descriptions: [
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/TIRS/Home.png`,
        ],

        texts: [
          "The Dashboard provides an overview of the Tricycle Integrated Records System, giving administrators a centralized view of driver records, violation activity, and compliance-related information.",
          "Administrators can monitor registered and temporary drivers, colorum cases, recorded violations, and violation processing status through summary cards, trend visualizations, and case breakdowns. The dashboard also highlights recent violations and the most common offenses to make frequently occurring issues easier to identify.",
          "The dashboard includes date-based filtering for today, the current week, the current month, or a custom date range. Data is retrieved from the system's backend and presented through interactive charts and tables, allowing administrators to analyze violation activity and monitor records more efficiently.",
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/TIRS/Profile.png`,
        ],
        texts: [
          "The Profile Pages provide a centralized interface for managing driver, colorum, and enforcer records within the Tricycle Integrated Records System. Administrators can switch between the different profile categories to view the records relevant to each group.",
          "Driver records display key information such as the driver's name, operator, classification, contact details, address, violation status, and associated TODA or franchise information. Colorum profiles are presented separately, while enforcer records include their identification number, contact information, and address. Administrators can also open individual profiles to view more detailed information or access a driver's transaction records.",
          "The page includes profile searching, alphabetical sorting, record counts, Excel export, and forms for adding new drivers or enforcers. New profile records are submitted through the backend API, with profile photos uploaded separately and associated with the corresponding record. This allows the interface to serve as both a record management tool and an entry point to the more detailed profile and transaction pages."
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/TIRS/Driver.png`,
          `${import.meta.env.BASE_URL}Manus/TIRS/Colorum.png`,
        ],
        texts: [
          "The Driver and Colorum Information pages provide a detailed view of an individual driver record, including personal information, contact details, classification, profile photo, and associated vehicle records. The same interface adapts to the driver's classification, with franchised drivers displaying their TODA and franchise information while Colorum profiles focus on their vehicle records.",
          "The page provides comprehensive vehicle management, allowing administrators to add vehicles, view and edit vehicle information, update vehicle status, and attach franchise records to vehicles. Each vehicle also displays its apprehension count and pending cases. The driver profile includes an apprehension history table containing ticket numbers, violations, locations, fines, payment information, status, and the enforcer involved, with a direct link to the driver's transaction details.",
          "Administrators can edit driver information, upload or update the driver's profile photo, print the driver's information, and manage general driver documents. Authorized administrators can upload, preview, download, and delete documents associated with the driver, while supported file types can be viewed directly through the document viewer. All profile, vehicle, franchise, apprehension, and document information is retrieved and updated through the system's backend API."
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/TIRS/Violation.png`,
        ],
        texts: [
          "The Violations page serves as the main interface for recording, reviewing, and managing apprehension records within the Tricycle Integrated Records System. Administrators can view violation records with their ticket number, violation code, violation details, apprehension date, violator, classification, official penalty, payment information, assigned enforcers, and current processing status.",
          "The page includes status summaries, search, classification filtering, and sorting tools to make large sets of apprehension records easier to manage. It also provides a separate view of records currently being processed by the administrator, while the full apprehension list allows administrators to review and edit eligible records. New apprehensions can be created for registered drivers, Colorum drivers, or unregistered persons, with vehicles, violations, enforcers, apprehension details, commission rates, and remarks recorded as part of the process.",
          "Each apprehension has its own workflow for processing and resolution. Administrators can start processing a case, record payments and upload payment receipts, settle and release connected vehicles, mark vehicles as impounded, or cancel and dispute records with a required reason. The system also displays processors and transaction history for each case, while ticket numbers, penalties, and status are handled through the backend workflow to keep the records consistent across the system."
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/TIRS/Settings2.png`,
        ],
        texts: [
          "The System Configuration page serves as the central configuration area of the Tricycle Integrated Records System. It provides administrators with tools for managing system-wide configuration, violation types and penalties, incentive rates, and the barangay and TODA directory.",
          "The General section provides account creation tools for super administrators, allowing authorized system users to be given a username, temporary password, and assigned role. The page also includes planned preferences for features such as dark mode, default table size, print layout, and system labels, which are currently marked as coming soon.",
          "The Violations & Penalties section allows administrators to create, edit, and deactivate violation types while defining their violation code, group, offense level, and penalty amount. The Barangay & TODA section manages TODA organizations assigned to Lucena barangays, including their officers and members, with tools for adding, editing, and removing records. System data is loaded and updated through the backend API, keeping these configuration records synchronized with the rest of TIRS."
        ],
      },
    ],
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
    github: "https://github.com/KNales179/FareCheckLucena",
    description:
      "An offline mobile application for calculating and verifying tricycle fares within Lucena City using local route data, offline maps, and an official fare matrix.",
    descriptions: [
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/FareCheck/Map.jpg`,
        ],
        texts: [
          "The Map page provides the main interface for selecting the origin and destination of a tricycle trip within Lucena City. Users can manually set their starting point and destination through the offline map or available location search, allowing the application to determine the trip without requiring an active internet connection or GPS for the selected starting point.",
          "After both locations are selected, the application validates that the points are within Lucena City and calculates the appropriate road route between them using locally available routing data. The calculated route is displayed directly on the map as a route line, giving users a visual representation of the path used to determine the trip distance.",
          "The map and routing functionality are designed to operate offline, with the necessary map tiles, location data, and routing resources stored locally on the device. This allows users to select locations and generate a route even when an internet connection is unavailable, providing the distance information required for the fare calculation process."
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/FareCheck/FareCheck.jpg`,
        ],
        texts: [
          "The FareCheck page calculates the estimated tricycle fare based on the route selected from the map. Users can choose between the applicable Regular and Special fare types and indicate whether the passenger is eligible for the available discount. These selections determine which fare rules are applied to the calculated trip.",
          "The application uses the route distance together with the locally stored fare matrix to calculate the corresponding fare. For regular fares, the calculation applies the official base fare, included distance, and additional fare per kilometer, while the Special fare uses its corresponding rates. Eligible passengers can also have the applicable discount automatically reflected in the calculation.",
          "The resulting fare is presented through a detailed fare breakdown showing the trip distance, base or included fare, additional distance charges, discount, and final amount. Once a fare has been generated, the result is locked to prevent the active route information from changing the displayed calculation until the user chooses to generate another fare."
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/FareCheck/FareMatrix.jpg`,
        ],
        texts: [
          "The Fare Matrix page provides users with the official reference information used by FareCheck Lucena when calculating tricycle fares. It presents the applicable fare rates and explains the basic computation used to determine the passenger's fare based on the distance of the trip.",
          "The page also provides the official source of the fare information, including the relevant Lucena City fare ordinance and TFRO reference materials. Users can view the official fare matrix and supporting information directly within the application, allowing them to understand the basis of the calculation rather than relying only on the final amount displayed by the fare calculator.",
          "For additional verification or concerns regarding tricycle fares, the page provides the official TFRO contact information and relevant reference links. This gives users a direct way to consult the responsible office and verify the fare information used by the application."
        ],
      },
    ],
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Native Android Integration",
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
    title: "Interactive Developer Portfolio",
    type: "Interactive Developer Portfolio",
    layout: "landscape",

    github: "https://github.com/KNales179/portfolio-Nales",

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

    descriptions: [
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/HomePage.png`,
          `${import.meta.env.BASE_URL}Manus/HomePage3.png`,
        ],

        texts: [
          "The Home page is the main entry point of the portfolio. It introduces me as a developer and gives visitors an immediate overview of my work and background.",
          "The page highlights my featured projects, technical skills, and development experience while providing clear navigation to other sections of the portfolio.",
          "Interactive elements and subtle animations make the page feel dynamic without distracting from the content. The layout is also responsive, adapting the presentation for desktop, and mobile devices."
        ]
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/ProjectPage.png`,
        ],

        texts: [
          "The Projects page presents the projects I have built and worked on throughout my development journey. It gives visitors a focused place to explore my work in more detail.",
          "Projects are organized by their current status, making it easy to distinguish completed projects from those still in development. Each project includes its type, description, technologies, and a visual preview.",
          "Visitors can open a project manuscript to explore additional screenshots and information about the project, providing a deeper look into how each project was designed and developed."]
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/CertiPage.png`,
        ],

        texts: [
          "The Certificates page showcases the professional certifications, training programs, and credentials I have earned throughout my academic and development journey.",
          "Each certificate is presented with its title, issuing organization, and relevant details, allowing visitors to quickly understand the skills and knowledge represented by each credential.",
          "The page uses an interactive and responsive layout to keep the certificates organized while maintaining the visual style and experience of the overall portfolio.",
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/AboutPage.png`,
        ],

        texts: [
          "The About Me page gives visitors a closer look at who I am beyond the projects I build. It introduces my background, interests, and the experiences that have shaped my journey in technology and software development.",
          "The page highlights my academic journey, achievements, and recognition received along the way, reflecting both my technical growth and the experiences that have influenced me as a developer.",
          "It also includes a collection of hobbies and interests that I enjoy outside of programming. Together, these sections provide a more personal perspective while keeping the presentation consistent with the overall design and experience of the portfolio.",
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/ContactPage.png`,
        ],

        texts: [
          "The Contact page provides visitors with a direct way to reach me for project opportunities, collaborations, freelance work, or professional inquiries.",
          "It includes my contact information and links to my social and professional profiles, along with an option to download my resume. Visitors can also use the contact form to send a message directly through the portfolio.",
          "The page also communicates my availability for development opportunities while maintaining a clean and approachable layout. Subtle animations and responsive design keep the interaction engaging across different screen sizes.",
        ],
      },
      {
        images: [
          `${import.meta.env.BASE_URL}Manus/AdminPage.png`,
          `${import.meta.env.BASE_URL}Manus/AdminPage2.png`,
        ],

        texts: [
          "The portfolio also includes a dedicated Admin interface that is currently under development. It is designed to give me a centralized way to manage the content of the portfolio without having to manually modify and redeploy the code whenever I want to make an update.",
          "The Admin interface will allow me to add, edit, and manage portfolio content such as projects, certificates, and other sections of the site. It will also provide personal analytics that track how visitors interact with the portfolio, helping me understand which pages and content receive the most engagement.",
          "Beyond portfolio management and analytics, the Admin interface includes a personal to-do system that I use to keep track of ongoing development work and side projects. The goal is to make the Admin area a personal workspace where I can manage my portfolio, review visitor activity, and organize the projects I am currently working on.",
        ],
      },
    ]
  }
];

export default projects;