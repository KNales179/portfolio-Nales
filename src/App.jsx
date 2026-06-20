import Navbar from "./components/Navbar";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Journey from "./sections/Journey";
import Awards from "./sections/Awards";
import Contact from "./sections/Contact";

function App() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Awards />
      <Contact />
    </main>
  );
}

export default App;