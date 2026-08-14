import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Shield,
    Calendar,
    Clock,
    Save,
} from "lucide-react";

import {
    getMyProfile,
    updateMyProfile,
    uploadProfileImage,
    deleteProfileImage,
} from "../../services/adminService";

import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAuth } from "../../context/AuthContext";

function Profile() {
    const { refreshAdmin } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [profile, setProfile] = useState(null);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [imageUploading, setImageUploading] = useState(false);

    // ============================================================
    // LOAD PROFILE
    // ============================================================

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await getMyProfile();

                setProfile(response.data);

                setForm({
                    fullName: response.data.fullName || "",
                    email: response.data.email || "",
                    phone: response.data.phone || "",
                });
            } catch (error) {
                console.error(
                    "Failed to load profile:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // ============================================================
    // INPUT
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };

    // ============================================================
    // PROFILE IMAGE UPLOAD
    // ============================================================

    const handleProfileImageChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image must be smaller than 5 MB."
            );
            event.target.value = "";
            return;
        }

        try {
            setImageUploading(true);
            setError("");
            setMessage("");

            const response =
                await uploadProfileImage(file);

            const updatedProfileImage =
                response.data.profileImage;

            setProfile((current) => ({
                ...current,
                profileImage: updatedProfileImage,
            }));

            await refreshAdmin();

            setMessage(
                "Profile image updated successfully."
            );
        } catch (err) {
            console.error(
                "Profile image upload failed:",
                err
            );

            setError(
                err.message ||
                "Failed to upload profile image."
            );
        } finally {
            setImageUploading(false);
            event.target.value = "";
        }
    };

    // ============================================================
    // DELETE PROFILE IMAGE
    // ============================================================

    const handleDeleteProfileImage = async () => {
        try {
            setImageUploading(true);
            setError("");
            setMessage("");

            await deleteProfileImage();

            setProfile((current) => ({
                ...current,
                profileImage: null,
            }));

            await refreshAdmin();

            setMessage(
                "Profile image removed successfully."
            );
        } catch (err) {
            console.error(
                "Profile image deletion failed:",
                err
            );

            setError(
                err.message ||
                "Failed to remove profile image."
            );
        } finally {
            setImageUploading(false);
        }
    };

    // ============================================================
    // SAVE PROFILE
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response =
                await updateMyProfile(form);

            setProfile(response.data);

            setForm({
                fullName:
                    response.data.fullName || "",
                email:
                    response.data.email || "",
                phone:
                    response.data.phone || "",
            });

            await refreshAdmin();

            setMessage(
                "Profile updated successfully."
            );
        } catch (err) {
            console.error(
                "Update profile error:",
                err
            );

            setError(
                err.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // SHARED ADMIN LAYOUT
    // ============================================================

    const renderAdminLayout = (content) => {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                {/* =================================================
                    ADMIN NAVBAR
                ================================================== */}

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (current) => !current
                        )
                    }
                />

                {/* =================================================
                    ADMIN SIDEBAR
                ================================================== */}

                <AdminSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                />

                {/* =================================================
                    MAIN CONTENT

                    IMPORTANT:
                    Uses the dynamic sidebar width.
                ================================================== */}

                <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">
                    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-12">
                        {content}
                    </div>
                </main>

            </div>
        );
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return renderAdminLayout(
            <p className="text-sm text-[var(--muted)]">
                Loading profile...
            </p>
        );
    }

    // ============================================================
    // ERROR / PROFILE NOT FOUND
    // ============================================================

    if (!profile) {
        return renderAdminLayout(
            <p className="text-sm text-red-400">
                {error ||
                    "Unable to load profile."}
            </p>
        );
    }

    // ============================================================
    // MAIN
    // ============================================================

    return renderAdminLayout(
        <>
            {/* =================================================
                HEADER
            ================================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.45,
                }}
                className="mb-8"
            >
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                    Administration
                </p>

            </motion.div>

            {/* =================================================
                PROFILE IMAGE CARD
            ================================================== */}

            <motion.section
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.45,
                    delay: 0.05,
                }}
                className="border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
            >
                <div className="flex flex-col items-center text-center">

                    {/* IMAGE */}

                    <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:h-36 sm:w-36">

                        {profile.profileImage?.url ? (
                            <img
                                src={
                                    profile.profileImage.url
                                }
                                alt={
                                    profile.fullName
                                }
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User
                                size={48}
                                className="text-[var(--muted)]"
                            />
                        )}

                        {imageUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-medium text-white">
                                Uploading...
                            </div>
                        )}
                    </div>

                    {/* IMAGE BUTTONS */}

                    <div className="mt-5 flex w-full max-w-sm flex-col gap-3 sm:flex-row">

                        <label
                            className={`flex h-10 flex-1 cursor-pointer items-center justify-center border border-[var(--border)] px-4 text-sm font-medium transition hover:border-purple-500/50 hover:text-purple-400 ${
                                imageUploading
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }`}
                        >
                            {profile.profileImage?.url
                                ? "Replace Image"
                                : "Upload Image"}

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={
                                    handleProfileImageChange
                                }
                                disabled={
                                    imageUploading
                                }
                            />
                        </label>

                        <button
                            type="button"
                            onClick={
                                handleDeleteProfileImage
                            }
                            disabled={
                                imageUploading ||
                                !profile.profileImage?.url
                            }
                            className="flex h-10 flex-1 items-center justify-center border border-red-500/20 px-4 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Remove
                        </button>

                    </div>

                    <p className="mt-3 text-xs text-[var(--muted)]">
                        PNG, JPG or WebP · Maximum 5 MB
                    </p>
                </div>
            </motion.section>

            {/* =================================================
                PERSONAL INFORMATION
            ================================================== */}

            <motion.form
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.45,
                    delay: 0.1,
                }}
                onSubmit={handleSubmit}
                className="mt-6 border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
            >
                <div className="mb-7">
                    <h2 className="text-lg font-semibold">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                        Update the information associated
                        with your administrator account.
                    </p>
                </div>

                {/* FORM GRID */}

                <div className="grid gap-5 md:grid-cols-2">

                    {/* FULL NAME */}

                    <div className="md:col-span-2">
                        <label
                            htmlFor="fullName"
                            className="mb-2 block text-sm font-medium"
                        >
                            Full Name
                        </label>

                        <div className="relative">
                            <User
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                            />

                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={
                                    form.fullName
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-purple-500/60"
                            />
                        </div>
                    </div>

                    {/* EMAIL */}

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <div className="relative">
                            <Mail
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                            />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-purple-500/60"
                            />
                        </div>
                    </div>

                    {/* PHONE */}

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium"
                        >
                            Phone
                        </label>

                        <div className="relative">
                            <Phone
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                            />

                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-purple-500/60"
                            />
                        </div>
                    </div>
                </div>

                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================== */}

                <div className="mt-8 border-t border-[var(--border)] pt-6">

                    <h3 className="mb-5 text-sm font-semibold">
                        Account Information
                    </h3>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {/* ROLE */}

                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                                <Shield size={17} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-[var(--muted)]">
                                    Role
                                </p>

                                <p className="mt-1 truncate text-sm font-medium">
                                    {profile.role}
                                </p>
                            </div>
                        </div>

                        {/* LAST LOGIN */}

                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                                <Clock size={17} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-[var(--muted)]">
                                    Last Login
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {profile.lastLogin
                                        ? new Date(
                                            profile.lastLogin
                                        ).toLocaleString()
                                        : "Never"}
                                </p>
                            </div>
                        </div>

                        {/* CREATED */}

                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                                <Calendar size={17} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-[var(--muted)]">
                                    Created
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {profile.createdAt
                                        ? new Date(
                                            profile.createdAt
                                        ).toLocaleDateString()
                                        : "Unknown"}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* =================================================
                    MESSAGE
                ================================================== */}

                {message && (
                    <p className="mt-6 text-sm text-green-400">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="mt-6 text-sm text-red-400">
                        {error}
                    </p>
                )}

                {/* =================================================
                    SAVE
                ================================================== */}

                <div className="mt-7 flex justify-end border-t border-[var(--border)] pt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex h-11 w-full items-center justify-center gap-2 bg-purple-500 px-6 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        <Save size={16} />

                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </div>
            </motion.form>
        </>
    );
}

export default Profile;