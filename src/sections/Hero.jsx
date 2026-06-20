import { motion } from "framer-motion";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 overflow-hidden"
    >
      {/* Purple Glow */}
      <div
        className="
          absolute
          right-[-200px]
          top-20
          w-[700px]
          h-[700px]
          rounded-full
          blur-[180px]
          opacity-20
        "
        style={{
          background: "var(--accent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-8 lg:px-12 min-h-screen flex items-center relative">

        {/* TEXT */}
        <motion.div
          className="relative z-20 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-purple-400 mb-4 text-lg">
            Hello, I'm
          </p>

          <h1 className="heading-font text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
            Beh
          </h1>

          <h2 className="text-2xl md:text-4xl font-semibold mb-6">
            Mobile & Full Stack Developer
          </h2>

          <p className="max-w-xl opacity-80 mb-8 leading-relaxed text-lg">
            I build mobile applications, backend systems,
            and administrative platforms focused on
            transportation and records management solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 transition">
              View Projects
            </button>

            <button className="px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 transition">
              Resume
            </button>
          </div>
        </motion.div>

        {/* PNG PHOTO */}
        <motion.img
          src="/beh.png"
          alt="Beh"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="
            absolute
            bottom-0
            right-0
            h-[85vh]
            object-contain
            pointer-events-none
            z-10
          "
        />
      </div>
    </section>
  );
}

export default Hero;