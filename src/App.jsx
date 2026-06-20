import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import ScrollProgress from "./components/ScrollProgress";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Journey from "./sections/Journey";
import Awards from "./sections/Awards";
import Contact from "./sections/Contact";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <AnimatedBackground />
      <ScrollProgress />

      <div className="relative z-10">
        <Navbar />

        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Awards />
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default App;