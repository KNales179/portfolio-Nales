// ============================================================
// SITE ASSETS
// ============================================================
//
// Small helpers for binary site assets that the admin can
// replace from the editor (currently just the résumé PDF).
// The uploaded URL lives on the "site" SiteText key
// (content.text.site.resumeUrl); until one is uploaded we fall
// back to the file bundled in /public.
// ============================================================

export const DEFAULT_RESUME_HREF = `${
    import.meta.env.BASE_URL
}Nales_Ivhel_Resume.pdf`;

export const resumeHref = (content) =>
    content?.text?.site?.resumeUrl || DEFAULT_RESUME_HREF;
