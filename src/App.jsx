import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import ScrollProgress from "./components/ScrollProgress";

import AnalyticsProvider from "./analytics/AnalyticsProvider";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Dashboard from "./pages/admin/dashboard/Dashboard";
import Profile from "./pages/admin/Profile";
import AuditLogs from "./pages/admin/AuditLogs";
import ManageAdmins from "./pages/admin/ManageAdmins";
import RegisterAdmin from "./pages/admin/RegisterAdmin";

import Security from "./pages/admin/settings/Security";
import Settings from "./pages/admin/settings/Settings";
import TrustedDevices from "./pages/admin/settings/TrustedDevices";
import AccountSection from "./pages/admin/settings/AccountSection";
import TwoFactor from "./pages/admin/settings/TwoFactor";

import WorkList from "./pages/admin/worklist/WorkList";
import WorkDetail from "./pages/admin/worklist/WorkDetail";
import EditPortfolio from "./pages/admin/dashboard/EditPortfolio";

import Login from "./pages/auth/Login";

function App() {
    return (
        <div className="relative min-h-screen overflow-x-clip">

            <AnalyticsProvider />

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
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/projects"
                            element={<Projects />}
                        />

                        <Route
                            path="/certificates"
                            element={<Certificates />}
                        />

                        <Route
                            path="/about"
                            element={<About />}
                        />

                        <Route
                            path="/contact"
                            element={<Contact />}
                        />

                        {/* =========================================
                            ADMIN AUTH
                        ========================================= */}

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        {/* =========================================
                            PROTECTED ADMIN
                        ========================================= */}

                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* =========================================
                            PORTFOLIO CONTENT EDITOR
                            The ONLY editing surface. Admin-only.
                        ========================================= */}

                        <Route
                            path="/admin/edit"
                            element={
                                <ProtectedRoute>
                                    <EditPortfolio />
                                </ProtectedRoute>
                            }
                        />

                        {/* =========================================
                            WORK SYSTEM
                        ========================================= */}

                        <Route
                            path="/admin/worklist"
                            element={
                                <ProtectedRoute>
                                    <WorkList />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/worklist/:workId"
                            element={
                                <ProtectedRoute>
                                    <WorkDetail />
                                </ProtectedRoute>
                            }
                        />

                        {/* =========================================
                            PROFILE
                        ========================================= */}

                        <Route
                            path="/admin/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* =========================================
                            SETTINGS
                        ========================================= */}

                        <Route
                            path="/admin/settings"
                            element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/settings/security"
                            element={
                                <ProtectedRoute>
                                    <Security />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/settings/trusted-devices"
                            element={
                                <ProtectedRoute>
                                    <TrustedDevices />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/settings/account"
                            element={
                                <ProtectedRoute>
                                    <AccountSection />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/settings/two-factor"
                            element={
                                <ProtectedRoute>
                                    <TwoFactor />
                                </ProtectedRoute>
                            }
                        />

                        {/* =========================================
                            AUDIT LOG
                        ========================================= */}

                        <Route
                            path="/admin/audit-logs"
                            element={
                                <ProtectedRoute>
                                    <AuditLogs />
                                </ProtectedRoute>
                            }
                        />

                        {/* =========================================
                            ADMIN MANAGEMENT
                        ========================================= */}

                        <Route
                            path="/admin/register"
                            element={
                                <ProtectedRoute>
                                    <RegisterAdmin />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/manage-admins"
                            element={
                                <ProtectedRoute>
                                    <ManageAdmins />
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