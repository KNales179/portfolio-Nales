import { motion } from "framer-motion";

function Contact() {
  return (
    <section
      id="contact"
      className="min-h-[70vh] flex items-center"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-purple-400 mb-4">
            Contact
          </p>

          <h2 className="heading-font text-5xl font-bold mb-6">
            Let's Build Something Great
          </h2>

          <p className="opacity-80 mb-10">
            Open to opportunities, collaborations,
            and professional connections.
          </p>

          <div className="flex flex-wrap justify-center gap-4">

            <a
              href="mailto:your@email.com"
              className="px-6 py-3 rounded-xl border"
            >
              Email
            </a>

            <a
              href="#"
              className="px-6 py-3 rounded-xl border"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="px-6 py-3 rounded-xl border"
            >
              Facebook
            </a>

            <a
              href="#"
              className="px-6 py-3 rounded-xl border"
            >
              Resume
            </a>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Contact;