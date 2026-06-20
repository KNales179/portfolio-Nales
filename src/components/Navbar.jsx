import { useEffect, useState } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-black/20 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="w-full h-20 px-8 lg:px-16 flex items-center justify-between">
        <h1 className="heading-font text-2xl font-bold">
          I-Bell (Ivhel)
        </h1>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#journey">Journey</a>
          <a href="#awards">Awards</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;