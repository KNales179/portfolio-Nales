import { useMemo } from "react";

import { usePortfolioContent } from "../../content/usePortfolioContent";
import { useProjects } from "../../content/useProjects";
import { resumeHref } from "../../content/siteAssets";


// ============================================================
// usePlayContent
// ============================================================
//
// The Play pages' single source of truth. It reads the exact
// same live DB content as the main site (hero / about / skills /
// journey / projects / awards / certificates / hobbies /
// contact links) and flattens it into one stable shape that
// every preset's section components consume.
//
// Presets never touch this — they only decide how it looks.
// ============================================================

const FALLBACK = {
    hero: {
        greeting: "Hello, I'm",
        name: "Ivhel Nales",
        role: "Mobile & Full-Stack Developer",
        description:
            "I build practical digital experiences, end to end.",
        photoUrl: "",
    },
    about: {
        label: "About",
        title:
            "Building practical systems through logic, planning, and continuous learning.",
        description: "",
    },
};


export const usePlayContent = () => {
    const {
        content,
        loading: contentLoading,
    } = usePortfolioContent();

    const {
        projects,
        loading: projectsLoading,
    } = useProjects();

    return useMemo(() => {
        const text = content.text || {};

        const hero = {
            ...FALLBACK.hero,
            ...(text.hero || {}),
        };

        const about = {
            ...FALLBACK.about,
            ...(text.about || {}),
        };

        return {
            loading:
                (contentLoading &&
                    content.skills.length === 0) ||
                (projectsLoading && projects.length === 0),

            hero,
            about,

            skills: content.skills || [],
            journey: content.journey || [],
            awards: content.awards || [],
            certificates: content.certificates || [],
            hobbies: content.hobbies || [],
            strengths: content.strengths || [],

            contacts: content.contactLinks || [],

            projects: projects || [],

            resumeHref: resumeHref(content),
        };
    }, [
        content,
        projects,
        contentLoading,
        projectsLoading,
    ]);
};
