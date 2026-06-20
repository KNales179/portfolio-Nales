import { motion } from "framer-motion";

function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-purple-400 mb-4">
            About Me
          </p>

          <h2 className="heading-font text-4xl font-bold mb-8">
            Building Real Systems
          </h2>

          <p className="max-w-3xl text-lg leading-relaxed opacity-80">
            I am a Mobile and Full Stack Developer with experience
            building transportation and records management systems.
            I independently learned React Native, Node.js, Express,
            and MongoDB beyond the university curriculum to create
            real-world solutions including TODA-GO and the Tricycle
            Integration Record System.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

export default About;