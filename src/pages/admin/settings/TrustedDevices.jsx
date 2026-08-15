import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Monitor,
    Smartphone,
    Tablet,
    ShieldCheck,
    ShieldAlert,
    Trash2,
    Loader2,
    AlertTriangle,
    X,
    RefreshCw,
} from "lucide-react";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { getDeviceInfo } from "../../../utils/deviceInfo";


// ============================================================
// CONFIG
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://portfolio-nales-backend.onrender.com";


// ============================================================
// AUTH TOKEN
// ============================================================

const getAuthToken = () => {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken")
    );
};


// ============================================================
// API REQUEST
// ============================================================

const apiRequest = async (
    endpoint,
    options = {}
) => {
    const token = getAuthToken();

    const deviceInfo = getDeviceInfo();

    const deviceId = deviceInfo.deviceId;

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                ...(token
                    ? {
                        Authorization:
                            `Bearer ${token}`,
                    }
                    : {}),

                "x-device-id":
                    deviceId,

                ...(options.headers || {}),
            },
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            "Request failed"
        );
    }

    return data;
};


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "Unknown";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Unknown";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );
};


// ============================================================
// FORMAT LAST ACTIVE
// ============================================================

const formatLastActive = (value) => {
    if (!value) {
        return "Unknown";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Unknown";
    }

    const diff =
        Date.now() -
        date.getTime();

    const seconds =
        Math.floor(
            diff / 1000
        );

    if (seconds < 60) {
        return "Active now";
    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1
            ? ""
            : "s"
            } ago`;
    }

    const hours =
        Math.floor(
            minutes / 60
        );

    if (hours < 24) {
        return `${hours} hour${hours === 1
            ? ""
            : "s"
            } ago`;
    }

    const days =
        Math.floor(
            hours / 24
        );

    return `${days} day${days === 1
        ? ""
        : "s"
        } ago`;
};


// ============================================================
// DEVICE TYPE
// ============================================================

const getDeviceType = (device) => {
    const text =
        `${device?.deviceName || ""} ${device?.operatingSystem || ""
            }`.toLowerCase();

    if (
        text.includes("android") ||
        text.includes("iphone") ||
        text.includes("mobile")
    ) {
        return "mobile";
    }

    if (
        text.includes("ipad") ||
        text.includes("tablet")
    ) {
        return "tablet";
    }

    return "desktop";
};


// ============================================================
// COMPONENT
// ============================================================

function TrustedDevices() {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    // ========================================================
    // DEVICES
    // ========================================================

    const [devices, setDevices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [pageError, setPageError] =
        useState("");


    // ========================================================
    // DEVICE ACTION STATE
    // ========================================================

    const [selectedDevice, setSelectedDevice] =
        useState(null);

    const [twoFactorCode, setTwoFactorCode] =
        useState("");

    const [actionModalOpen, setActionModalOpen] =
        useState(false);

    const [actionType, setActionType] =
        useState(null);

    const [actionLoadingId, setActionLoadingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [revokeModalOpen, setRevokeModalOpen] =
        useState(false);

    const [revokeDevice, setRevokeDevice] =
        useState(null);


    // ========================================================
    // DEVICE ICON
    // ========================================================

    const getDeviceIcon = (type) => {
        if (type === "mobile") {
            return Smartphone;
        }

        if (type === "tablet") {
            return Tablet;
        }

        return Monitor;
    };


    // ========================================================
    // FETCH DEVICES
    // ========================================================

    const fetchDevices = async (
        showRefreshLoader = false
    ) => {
        try {
            if (showRefreshLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setPageError("");

            const response =
                await apiRequest(
                    "/api/auth/trusted-devices"
                );

            const fetchedDevices =
                response?.data?.devices ||
                [];

            // ------------------------------------------------
            // FRONTEND SAFETY AGAINST DUPLICATES
            // ------------------------------------------------

            const uniqueDevices =
                Array.from(
                    new Map(
                        fetchedDevices.map(
                            (device) => [
                                device.deviceId,
                                device,
                            ]
                        )
                    ).values()
                );

            setDevices(
                uniqueDevices
            );

        } catch (error) {
            console.error(
                "Failed to fetch devices:",
                error
            );

            setPageError(
                error?.message ||
                "Unable to load your devices."
            );

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    // ========================================================
    // INITIAL FETCH
    // ========================================================

    useEffect(() => {
        fetchDevices();
    }, []);


    // ========================================================
    // OPEN ACTION MODAL
    // ========================================================

    const openActionModal = (
        device,
        type
    ) => {
        setSelectedDevice(device);
        setActionType(type);
        setTwoFactorCode("");
        setError("");
        setActionModalOpen(true);
    };


    // ========================================================
    // CLOSE ACTION MODAL
    // ========================================================

    const closeActionModal = () => {
        if (actionLoadingId !== null) {
            return;
        }

        setActionModalOpen(false);
        setSelectedDevice(null);
        setActionType(null);
        setTwoFactorCode("");
        setError("");
    };


    // ========================================================
    // TRUST DEVICE
    // ========================================================

    const handleTrust = async () => {
        if (!selectedDevice) {
            return;
        }

        const cleanCode =
            twoFactorCode.replace(
                /\D/g,
                ""
            );

        if (cleanCode.length !== 6) {
            setError(
                "Enter the current 6-digit authentication code."
            );

            return;
        }

        try {
            setActionLoadingId(
                selectedDevice.deviceId
            );

            setError("");

            // ------------------------------------------------
            // TRUST SELECTED DEVICE
            // ------------------------------------------------

            await apiRequest(
                `/api/auth/trusted-devices/${encodeURIComponent(
                    selectedDevice.deviceId
                )}`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        code: cleanCode,
                    }),
                }
            );

            closeActionModal();

            await fetchDevices(true);

        } catch (error) {
            console.error(
                "Failed to trust device:",
                error
            );

            setError(
                error?.message ||
                "Unable to trust this device."
            );

        } finally {
            setActionLoadingId(null);
        }
    };


    // ========================================================
    // REVOKE TRUST
    // ========================================================

    const handleRevoke = async () => {
        if (!selectedDevice) {
            return;
        }

        const cleanCode =
            twoFactorCode.replace(
                /\D/g,
                ""
            );

        if (cleanCode.length !== 6) {
            setError(
                "Enter the current 6-digit authentication code."
            );

            return;
        }

        try {
            setActionLoadingId(
                selectedDevice.deviceId
            );

            setError("");

            // ------------------------------------------------
            // REMOVE TRUST ONLY
            // ------------------------------------------------

            await apiRequest(
                `/api/auth/trusted-devices/${encodeURIComponent(
                    selectedDevice.deviceId
                )}`,
                {
                    method: "DELETE",

                    body: JSON.stringify({
                        code: cleanCode,
                    }),
                }
            );

            closeActionModal();

            await fetchDevices(true);

        } catch (error) {
            console.error(
                "Failed to revoke trusted device:",
                error
            );

            setError(
                error?.message ||
                "Unable to revoke trust from this device."
            );

        } finally {
            setActionLoadingId(null);
        }
    };


    // ========================================================
    // DELETE DEVICE
    // ========================================================

    const handleDelete = async () => {
        if (!selectedDevice) {
            return;
        }

        const cleanCode =
            twoFactorCode.replace(
                /\D/g,
                ""
            );

        if (cleanCode.length !== 6) {
            setError(
                "Enter the current 6-digit authentication code."
            );

            return;
        }

        try {
            setActionLoadingId(
                selectedDevice.deviceId
            );

            setError("");

            // ------------------------------------------------
            // PERMANENT DELETE
            //
            // TRUSTED DEVICE:
            // 1. Remove trusted entry
            // 2. Delete AdminSession
            //
            // UNTRUSTED DEVICE:
            // 1. Delete AdminSession
            // ------------------------------------------------

            await apiRequest(
                `/api/auth/trusted-devices/${encodeURIComponent(
                    selectedDevice.deviceId
                )}/permanent`,
                {
                    method: "DELETE",

                    body: JSON.stringify({
                        code: cleanCode,
                    }),
                }
            );

            closeActionModal();

            await fetchDevices(true);

        } catch (error) {
            console.error(
                "Failed to delete device:",
                error
            );

            setError(
                error?.message ||
                "Unable to delete this device."
            );

        } finally {
            setActionLoadingId(null);
        }
    };


    // ========================================================
    // MODAL ACTION HANDLER
    // ========================================================

    const handleModalAction = () => {
        if (actionType === "trust") {
            return handleTrust();
        }

        if (actionType === "revoke") {
            return handleRevoke();
        }

        if (actionType === "delete") {
            return handleDelete();
        }
    };


    // ========================================================
    // MODAL CONTENT
    // ========================================================

    const getModalTitle = () => {
        if (actionType === "trust") {
            return "Trust device";
        }

        if (actionType === "revoke") {
            return "Revoke trusted device";
        }

        if (actionType === "delete") {
            return "Delete device";
        }

        return "Device action";
    };


    const getModalDescription = () => {
        if (actionType === "trust") {
            return "Additional verification is required.";
        }

        if (actionType === "revoke") {
            return "Additional verification is required.";
        }

        if (actionType === "delete") {
            return "Additional verification is required before permanently deleting this device.";
        }

        return "";
    };


    const getModalButtonText = () => {
        if (actionType === "trust") {
            return "Trust device";
        }

        if (actionType === "revoke") {
            return "Revoke trust";
        }

        if (actionType === "delete") {
            return "Delete device";
        }

        return "Confirm";
    };


    // ========================================================
    // TRUSTED DEVICE COUNT
    // ========================================================

    const trustedDeviceCount =
        devices.filter(
            (device) =>
                device.isTrusted
        ).length;


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-[var(--surface)]">

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen(
                        (current) =>
                            !current
                    )
                }
            />


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <AdminSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-12">

                    {/* ==================================================
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
                    >

                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                            <div>

                                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                                    Security
                                </p>

                                <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                                    Trusted devices.
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                    Manage the devices that have
                                    accessed your administrator
                                    account.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    fetchDevices(true)
                                }
                                disabled={
                                    loading ||
                                    refreshing
                                }
                                className="flex items-center justify-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--card)] disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {refreshing ? (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <RefreshCw
                                        size={16}
                                    />
                                )}

                                Refresh

                            </button>

                        </div>

                    </motion.div>


                    {/* ==================================================
                        INFORMATION NOTICE
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
                            duration: 0.4,
                            delay: 0.05,
                        }}
                        className="mt-8 border border-purple-500/20 bg-purple-500/5 p-5"
                    >

                        <div className="flex items-start gap-3">

                            <ShieldCheck
                                size={20}
                                className="mt-0.5 shrink-0 text-purple-400"
                            />

                            <div>

                                <p className="text-sm font-semibold">
                                    About trusted devices
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                    Devices that have logged into
                                    your account are shown below.
                                    Trusted devices can sign in
                                    without repeating device
                                    verification until their
                                    2FA trust period expires.
                                    Trusting, revoking trust, and
                                    deleting a device require
                                    authentication verification.
                                </p>

                            </div>

                        </div>

                    </motion.div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {pageError && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/5 p-5">

                            <div className="flex items-start gap-3">

                                <AlertTriangle
                                    size={19}
                                    className="mt-0.5 shrink-0 text-red-400"
                                />

                                <div>

                                    <p className="text-sm font-semibold text-red-400">
                                        Unable to load devices
                                    </p>

                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        {pageError}
                                    </p>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        DEVICES
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
                            duration: 0.4,
                            delay: 0.1,
                        }}
                        className="mt-6 border border-[var(--border)] bg-[var(--card)]"
                    >

                        {/* SECTION HEADER */}

                        <div className="flex flex-col gap-4 border-b border-[var(--border)] p-6 md:flex-row md:items-center md:justify-between">

                            <div>

                                <h2 className="text-lg font-semibold">
                                    Account devices
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    {devices.length} device
                                    {devices.length === 1
                                        ? ""
                                        : "s"}{" "}
                                    associated with your
                                    administrator account.
                                    {trustedDeviceCount > 0 &&
                                        ` ${trustedDeviceCount} trusted.`}
                                </p>

                            </div>

                        </div>


                        {/* ==================================================
                            LOADING
                        ================================================== */}

                        {loading ? (

                            <div className="flex items-center justify-center p-12">

                                <div className="flex items-center gap-3 text-sm text-[var(--muted)]">

                                    <Loader2
                                        size={20}
                                        className="animate-spin"
                                    />

                                    Loading devices...

                                </div>

                            </div>

                        ) : devices.length === 0 ? (

                            <div className="p-10 text-center">

                                <ShieldCheck
                                    size={30}
                                    className="mx-auto text-[var(--muted)]"
                                />

                                <p className="mt-4 text-sm font-medium">
                                    No devices found
                                </p>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    No login sessions are currently
                                    associated with your account.
                                </p>

                            </div>

                        ) : (

                            <div className="divide-y divide-[var(--border)]">

                                {devices.map(
                                    (
                                        device,
                                        index
                                    ) => {

                                        const type =
                                            getDeviceType(
                                                device
                                            );

                                        const DeviceIcon =
                                            getDeviceIcon(
                                                type
                                            );

                                        const isLoading =
                                            actionLoadingId ===
                                            device.deviceId;

                                        return (
                                            <motion.div
                                                key={
                                                    device.deviceId
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    y: 10,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    duration:
                                                        0.35,
                                                    delay:
                                                        0.12 +
                                                        index *
                                                        0.05,
                                                }}
                                                className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between"
                                            >

                                                {/* DEVICE INFO */}

                                                <div className="flex min-w-0 items-start gap-4">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-purple-500/10 text-purple-400">

                                                        <DeviceIcon
                                                            size={22}
                                                        />

                                                    </div>


                                                    <div className="min-w-0">

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <h3 className="text-base font-semibold">
                                                                {
                                                                    device.deviceName ||
                                                                    "Unknown Device"
                                                                }
                                                            </h3>


                                                            {device.isCurrentDevice && (
                                                                <span className="bg-green-500/10 px-2 py-1 text-[11px] font-semibold text-green-400">
                                                                    This device
                                                                </span>
                                                            )}


                                                            {device.isTrusted ? (
                                                                <span className="flex items-center gap-1 bg-purple-500/10 px-2 py-1 text-[11px] font-semibold text-purple-400">

                                                                    <ShieldCheck
                                                                        size={12}
                                                                    />

                                                                    Trusted

                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 text-[11px] font-semibold text-yellow-400">

                                                                    <ShieldAlert
                                                                        size={12}
                                                                    />

                                                                    Not trusted

                                                                </span>
                                                            )}

                                                        </div>


                                                        <p className="mt-1 text-sm text-[var(--muted)]">

                                                            {
                                                                device.browser ||
                                                                "Unknown Browser"
                                                            }

                                                            {" · "}

                                                            {
                                                                device.operatingSystem ||
                                                                "Unknown OS"
                                                            }

                                                        </p>


                                                        <div className="mt-3 grid gap-1 text-xs text-[var(--muted)] sm:grid-cols-2 sm:gap-x-8">

                                                            <span>
                                                                Location:{" "}
                                                                {device.location?.city ||
                                                                    device.location?.region ||
                                                                    device.location?.country ||
                                                                    "Unknown location"}
                                                            </span>

                                                            <span>
                                                                Last active:{" "}
                                                                {formatLastActive(
                                                                    device.lastUsedAt
                                                                )}
                                                            </span>

                                                            <span>
                                                                First login:{" "}
                                                                {formatDate(
                                                                    device.firstLoginAt
                                                                )}
                                                            </span>

                                                            <span>
                                                                IP:{" "}
                                                                {device.ipAddress ||
                                                                    "Unknown"}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* ==================================================
                                                    ACTIONS
                                                ================================================== */}

                                                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">

                                                    {/* TRUSTED */}

                                                    {device.isTrusted ? (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openActionModal(
                                                                    device,
                                                                    "revoke"
                                                                )
                                                            }
                                                            disabled={
                                                                isLoading
                                                            }
                                                            className="flex items-center justify-center gap-2 border border-yellow-500/30 px-4 py-2.5 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {isLoading &&
                                                                actionType ===
                                                                "revoke" ? (
                                                                <Loader2
                                                                    size={16}
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <ShieldAlert
                                                                    size={16}
                                                                />
                                                            )}

                                                            Revoke trust

                                                        </button>

                                                    ) : (

                                                        /* UNTRUSTED */

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openActionModal(
                                                                    device,
                                                                    "trust"
                                                                )
                                                            }
                                                            disabled={
                                                                isLoading
                                                            }
                                                            className="flex items-center justify-center gap-2 border border-purple-500/30 px-4 py-2.5 text-sm font-semibold text-purple-400 transition hover:bg-purple-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {isLoading &&
                                                                actionType ===
                                                                "trust" ? (
                                                                <Loader2
                                                                    size={16}
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <ShieldCheck
                                                                    size={16}
                                                                />
                                                            )}

                                                            Trust

                                                        </button>

                                                    )}


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openActionModal(
                                                                device,
                                                                "delete"
                                                            )
                                                        }
                                                        disabled={
                                                            isLoading
                                                        }
                                                        className="flex items-center justify-center gap-2 border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >

                                                        {isLoading &&
                                                            actionType ===
                                                            "delete" ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2
                                                                size={16}
                                                            />
                                                        )}

                                                        Delete

                                                    </button>

                                                </div>

                                            </motion.div>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </motion.section>


                    {/* ==================================================
                        SECURITY WARNING
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
                            duration: 0.4,
                            delay: 0.2,
                        }}
                        className="mt-6 border border-yellow-500/20 bg-yellow-500/5 p-5"
                    >

                        <div className="flex items-start gap-3">

                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0 text-yellow-400"
                            />

                            <div>

                                <p className="text-sm font-semibold">
                                    Lost or compromised device?
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                    Revoke its trusted status or
                                    permanently delete the device
                                    session. Both actions require
                                    your authenticator code.
                                    Deleting a trusted device
                                    automatically removes its trusted
                                    status before the session is
                                    deleted.
                                </p>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </main>


            {/* ========================================================
                TRUST / REVOKE / DELETE 2FA MODAL
            ======================================================== */}

            {actionModalOpen &&
                selectedDevice && (

                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5">

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            className="w-full max-w-md border border-[var(--border)] bg-[var(--card)] shadow-2xl"
                        >

                            {/* HEADER */}

                            <div className="flex items-start justify-between border-b border-[var(--border)] p-6">

                                <div className="flex items-start gap-3">

                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center ${actionType === "delete"
                                            ? "bg-red-500/10 text-red-400"
                                            : actionType === "revoke"
                                                ? "bg-yellow-500/10 text-yellow-400"
                                                : "bg-purple-500/10 text-purple-400"
                                            }`}
                                    >

                                        {actionType === "delete" ? (
                                            <Trash2 size={20} />
                                        ) : actionType === "revoke" ? (
                                            <ShieldAlert size={20} />
                                        ) : (
                                            <ShieldCheck size={20} />
                                        )}

                                    </div>


                                    <div>

                                        <h2 className="text-lg font-semibold">
                                            {getModalTitle()}
                                        </h2>

                                        <p className="mt-1 text-sm text-[var(--muted)]">
                                            {getModalDescription()}
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={closeActionModal}
                                    disabled={
                                        actionLoadingId !== null
                                    }
                                    className="text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-50"
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            {/* CONTENT */}

                            <div className="p-6">

                                <div
                                    className={`border p-4 ${actionType === "delete"
                                        ? "border-red-500/20 bg-red-500/5"
                                        : actionType === "revoke"
                                            ? "border-yellow-500/20 bg-yellow-500/5"
                                            : "border-purple-500/20 bg-purple-500/5"
                                        }`}
                                >

                                    <p className="text-sm font-medium">

                                        {actionType === "trust"
                                            ? "You are trusting:"
                                            : actionType === "revoke"
                                                ? "You are removing trust from:"
                                                : "You are permanently deleting:"
                                        }

                                    </p>

                                    <p className="mt-1 text-sm text-[var(--muted)]">

                                        {
                                            selectedDevice.deviceName ||
                                            "Unknown Device"
                                        }

                                        {" · "}

                                        {
                                            selectedDevice.browser ||
                                            "Unknown Browser"
                                        }

                                    </p>


                                    {/* TRUST MESSAGE */}

                                    {actionType === "trust" && (
                                        <p className="mt-3 text-xs leading-5 text-purple-400">
                                            This device will be added
                                            to your trusted devices
                                            after successful
                                            verification.
                                        </p>
                                    )}


                                    {/* REVOKE MESSAGE */}

                                    {actionType === "revoke" && (
                                        <p className="mt-3 text-xs leading-5 text-yellow-400">
                                            The device will remain
                                            in your account sessions,
                                            but it will no longer
                                            be trusted.
                                        </p>
                                    )}


                                    {/* DELETE MESSAGE */}

                                    {actionType === "delete" && (
                                        <p className="mt-3 text-xs leading-5 text-red-400">
                                            This action permanently
                                            removes the device session.
                                            {selectedDevice.isTrusted
                                                ? " Because this device is trusted, its trusted status will be removed before the session is deleted."
                                                : " This device is not trusted, so its session will simply be deleted."
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* ==================================================
                                    2FA
                                ================================================== */}

                                <div className="mt-6">

                                    <label
                                        htmlFor="deviceActionTwoFactorCode"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Authenticator code
                                    </label>

                                    <input
                                        id="deviceActionTwoFactorCode"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        value={
                                            twoFactorCode
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            setTwoFactorCode(
                                                event.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            );

                                            setError("");
                                        }}
                                        placeholder="000000"
                                        disabled={
                                            actionLoadingId !== null
                                        }
                                        className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none focus:border-purple-400 disabled:opacity-60"
                                    />

                                    <p className="mt-2 text-xs text-[var(--muted)]">
                                        Enter the current 6-digit
                                        code from your authenticator
                                        app.
                                    </p>

                                </div>


                                {/* ==================================================
                                    ERROR
                                ================================================== */}

                                {error && (
                                    <p
                                        className="mt-4 text-sm text-red-400"
                                        role="alert"
                                    >
                                        {error}
                                    </p>
                                )}


                                {/* ==================================================
                                    ACTIONS
                                ================================================== */}

                                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                    <button
                                        type="button"
                                        onClick={
                                            closeActionModal
                                        }
                                        disabled={
                                            actionLoadingId !==
                                            null
                                        }
                                        className="border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface)] disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            handleModalAction
                                        }
                                        disabled={
                                            actionLoadingId !==
                                            null ||
                                            twoFactorCode.length !==
                                            6
                                        }
                                        className={`flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${actionType === "delete"
                                            ? "bg-red-500 hover:bg-red-600"
                                            : actionType === "revoke"
                                                ? "bg-yellow-500 hover:bg-yellow-600"
                                                : "bg-purple-500 hover:bg-purple-600"
                                            }`}
                                    >

                                        {actionLoadingId !==
                                            null ? (
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                        ) : actionType ===
                                            "delete" ? (
                                            <Trash2
                                                size={17}
                                            />
                                        ) : actionType ===
                                            "revoke" ? (
                                            <ShieldAlert
                                                size={17}
                                            />
                                        ) : (
                                            <ShieldCheck
                                                size={17}
                                            />
                                        )}

                                        {getModalButtonText()}

                                    </button>

                                </div>

                            </div>

                        </motion.div>

                    </div>
                )}

        </div>
    );
}

export default TrustedDevices;