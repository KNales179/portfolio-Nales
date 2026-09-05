import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navigationLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Projects",
    path: "/projects",
  },
  {
    label: "Certificates",
    path: "/certificates",
  },
  {
    label: "About Me",
    path: "/about",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  /*
    Detect whether the page has been scrolled.
    This is only used for the navbar appearance,
    not for section navigation anymore.
  */
  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleNavigation = (path) => {
    setMenuOpen(false);

    navigate(path);

    /*
      Start every new page at the top.
    */
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${scrolled || menuOpen
          ? "border-b border-[var(--border)] bg-[var(--surface)]/85 shadow-lg shadow-black/5 backdrop-blur-xl"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16">

        {/* =========================
            BRAND
        ========================== */}
        <button
          type="button"
          onClick={() => handleNavigation("/")}
          className="group flex shrink-0 items-center gap-3"
        >
          <img
            src={`${import.meta.env.BASE_URL}IBell.png`}
            alt="I-Bell logo"
            className="h-11 w-11 rounded-xl object-cover shadow-md shadow-purple-950/20 transition duration-300 group-hover:scale-105"
          />

          <div className="text-left">
            <p className="heading-font text-lg font-bold leading-none text-[var(--text)] md:text-xl">
              I-Bell
            </p>

            <p className="mt-1 text-xs text-purple-400/80">
              Ivhel Nales
            </p>
          </div>
        </button>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <nav className="hidden items-center gap-2 md:flex">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className={({ isActive }) =>
                `group relative rounded-xl px-4 py-2 text-sm font-medium transition duration-300 ${isActive
                  ? "bg-purple-500/15 text-purple-500 dark:text-purple-300"
                  : "text-[var(--text)]/70 hover:bg-[var(--surface)]/70 hover:text-[var(--text)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}

                  <span
                    className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-purple-500 transition-all duration-300 ${isActive
                        ? "w-6 opacity-100"
                        : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                      }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 text-[var(--text)] backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-purple-500/10 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.span
                key="close"
                initial={{
                  rotate: -90,
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  rotate: 90,
                  opacity: 0,
                  scale: 0.7,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{
                  rotate: 90,
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  rotate: -90,
                  opacity: 0,
                  scale: 0.7,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{
              opacity: 0,
              y: -18,
              height: 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              y: -18,
              height: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--surface)]/95 px-5 py-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navigationLinks.map((link, index) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => {
                    setMenuOpen(false);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  {({ isActive }) => (
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: -18,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -18,
                      }}
                      transition={{
                        duration: 0.28,
                        delay: index * 0.045,
                      }}
                      className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition ${isActive
                          ? "bg-purple-500/15 text-purple-500"
                          : "text-[var(--text)]/75 hover:bg-purple-500/10"
                        }`}
                    >
                      {link.label}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;