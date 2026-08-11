import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import ScrollProgress from "./components/ScrollProgress";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <AnimatedBackground />
      <ScrollProgress />

      <div className="relative z-10">
        <Navbar />

        <main>
          <Routes>
            <Route path="/portfolio-Nales" element={<Home />} />

            <Route
              path="/portfolio-Nales/projects"
              element={<Projects />}
            />

            <Route
              path="/portfolio-Nales/certificates"
              element={<Certificates />}
            />

            <Route
              path="/portfolio-Nales/about"
              element={<About />}
            />

            <Route
              path="/portfolio-Nales/contact"
              element={<Contact />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;