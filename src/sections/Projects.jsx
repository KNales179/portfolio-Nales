import { motion } from "framer-motion";

function Projects() {
  return (
    <section id="projects" className="py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        <p className="text-purple-400 mb-4">
          Featured Projects
        </p>

        <h2 className="heading-font text-4xl font-bold mb-16">
          Systems I Built
        </h2>

        <motion.div
          className="rounded-3xl border p-8 mb-10"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-3xl font-bold mb-4">
            TODA-GO
          </h3>

          <p className="opacity-80 mb-6">
            Ride-hailing platform with Passenger App,
            Driver App, Backend API, and Admin Dashboard.
          </p>

          <div className="flex flex-wrap gap-3">
            <span>React Native</span>
            <span>Node.js</span>
            <span>MongoDB</span>
            <span>Express</span>
          </div>
        </motion.div>

        <motion.div
          className="rounded-3xl border p-8"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-3xl font-bold mb-4">
            Tricycle Integration Record System
          </h3>

          <p className="opacity-80 mb-6">
            Records management system for drivers,
            vehicles, enforcers, staff, violations,
            and administrative transactions.
          </p>

          <div className="flex flex-wrap gap-3">
            <span>React</span>
            <span>Node.js</span>
            <span>MongoDB</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Projects;