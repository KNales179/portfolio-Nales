import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import ScrollProgress from "./components/ScrollProgress";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Dashboard from "./pages/admin/dashboard/Dashboard";
import Profile from "./pages/admin/Profile";
import Security from "./pages/admin/settings/Security";
import Settings from "./pages/admin/settings/Settings";
import TrustedDevices from "./pages/admin/settings/TrustedDevices";
import AccountSection from "./pages/admin/settings/AccountSection";
import TwoFactor from "./pages/admin/settings/TwoFactor";

import Login from "./pages/auth/Login";

function App() {
    return (
        <div className="relative min-h-screen overflow-x-clip">

            <AnimatedBackground />
            <ScrollProgress />

            <div className="relative z-10">

                <Navbar />

                <main>
                    <Routes>

                        {/* =========================================
                            PUBLIC PORTFOLIO
                        ========================================= */}

                        <Route
                            path="/portfolio-Nales"
                            element={<Home />}
                        />

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

                        {/* =========================================
                            ADMIN AUTH
                        ========================================= */}

                        <Route
                            path="/portfolio-Nales/login"
                            element={<Login />}
                        />

                        {/* =========================================
                            PROTECTED ADMIN
                        ========================================= */}

                        <Route
                            path="/portfolio-Nales/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/portfolio-Nales/admin/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/portfolio-Nales/admin/settings"
                            element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/portfolio-Nales/admin/settings/security"
                            element={
                                <ProtectedRoute>
                                    <Security />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/portfolio-Nales/admin/settings/trusted-devices"
                            element={
                                <ProtectedRoute>
                                    <TrustedDevices />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/portfolio-Nales/admin/settings/account"
                            element={
                                <ProtectedRoute>
                                    <AccountSection />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/portfolio-Nales/admin/settings/two-factor"
                            element={
                                <ProtectedRoute>
                                    <TwoFactor />
                                </ProtectedRoute>
                            }
                        />

                    </Routes>
                </main>

            </div>

        </div>
    );
}

export default App;