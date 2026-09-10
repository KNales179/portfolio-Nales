// ============================================================
// PLAY — WEB FONTS
// ============================================================
//
// Every non-default preset's display / body faces, in one
// stylesheet link injected on demand (only when the Play
// preview is open or a preset is applied).
// ============================================================

export const PLAY_FONTS_ID = "play-fonts";

export const PLAY_FONTS_HREF =
    "https://fonts.googleapis.com/css2" +
    "?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,600" +
    "&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400" +
    "&family=JetBrains+Mono:wght@400;500;700" +
    "&family=Space+Grotesk:wght@400;500;700" +
    "&family=Fredoka:wght@400;500;600;700" +
    "&family=Archivo+Black" +
    "&display=swap";


export const ensurePlayFonts = () => {
    if (typeof document === "undefined") {
        return;
    }
    if (document.getElementById(PLAY_FONTS_ID)) {
        return;
    }
    const link = document.createElement("link");
    link.id = PLAY_FONTS_ID;
    link.rel = "stylesheet";
    link.href = PLAY_FONTS_HREF;
    document.head.appendChild(link);
};
