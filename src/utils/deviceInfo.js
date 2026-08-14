// ============================================================
// DEVICE INFORMATION
// ============================================================

const DEVICE_ID_KEY = "device_id";

// ------------------------------------------------------------
// GET / CREATE DEVICE ID
// ------------------------------------------------------------

export const getDeviceId = () => {
    let deviceId =
        localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
        deviceId =
            crypto.randomUUID();

        localStorage.setItem(
            DEVICE_ID_KEY,
            deviceId
        );
    }

    return deviceId;
};

// ------------------------------------------------------------
// GET DEVICE NAME
// ------------------------------------------------------------

export const getDeviceName = () => {
    const userAgent =
        navigator.userAgent;

    if (/Windows/i.test(userAgent)) {
        return "Windows Device";
    }

    if (/Macintosh|Mac OS X/i.test(userAgent)) {
        return "Mac Device";
    }

    if (/Android/i.test(userAgent)) {
        return "Android Device";
    }

    if (/iPhone|iPad/i.test(userAgent)) {
        return "iOS Device";
    }

    if (/Linux/i.test(userAgent)) {
        return "Linux Device";
    }

    return "Unknown Device";
};

// ------------------------------------------------------------
// GET BROWSER
// ------------------------------------------------------------

export const getBrowser = () => {
    const userAgent =
        navigator.userAgent;

    if (
        userAgent.includes("Edg/")
    ) {
        return "Microsoft Edge";
    }

    if (
        userAgent.includes("Chrome/") &&
        !userAgent.includes("Edg/")
    ) {
        return "Google Chrome";
    }

    if (
        userAgent.includes("Firefox/")
    ) {
        return "Mozilla Firefox";
    }

    if (
        userAgent.includes("Safari/") &&
        !userAgent.includes("Chrome/")
    ) {
        return "Safari";
    }

    if (
        userAgent.includes("OPR/") ||
        userAgent.includes("Opera/")
    ) {
        return "Opera";
    }

    return "Unknown Browser";
};

// ------------------------------------------------------------
// GET OPERATING SYSTEM
// ------------------------------------------------------------

export const getOperatingSystem = () => {
    const userAgent =
        navigator.userAgent;

    if (/Windows NT/i.test(userAgent)) {
        return "Windows";
    }

    if (/Mac OS X/i.test(userAgent)) {
        return "macOS";
    }

    if (/Android/i.test(userAgent)) {
        return "Android";
    }

    if (
        /iPhone|iPad|iPod/i.test(userAgent)
    ) {
        return "iOS";
    }

    if (/Linux/i.test(userAgent)) {
        return "Linux";
    }

    return "Unknown OS";
};

// ------------------------------------------------------------
// GET ALL DEVICE INFORMATION
// ------------------------------------------------------------

export const getDeviceInfo = () => {
    return {
        deviceId: getDeviceId(),
        deviceName: getDeviceName(),
        browser: getBrowser(),
        operatingSystem:
            getOperatingSystem(),
    };
};