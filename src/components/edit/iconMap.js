import {
    Award,
    BookOpen,
    BrainCircuit,
    Code2,
    Database,
    HeartHandshake,
    Layers,
    Lightbulb,
    Link as LinkIcon,
    Mail,
    Microscope,
    Rocket,
    Sparkles,
    TrendingUp,
    Wrench,
} from "lucide-react";

import {
    FaFacebook,
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaWhatsapp,
} from "react-icons/fa";


// ============================================================
// ICON MAP
// ============================================================
//
// Content stores an icon as a string that is either a known
// NAME ("Code2", "FaLinkedin") or an absolute image URL.
//
// `resolveIcon(name)` maps a NAME to a component (unknown names
// fall back so a bad value never crashes a section). URL values
// are rendered as an <img> by <EditableIcon>, not here.
// ============================================================

const ICONS = {
    // lucide
    Award,
    BookOpen,
    BrainCircuit,
    Code2,
    Database,
    HeartHandshake,
    Layers,
    Lightbulb,
    Link: LinkIcon,
    Mail,
    Microscope,
    Rocket,
    Sparkles,
    TrendingUp,
    Wrench,

    // react-icons
    FaFacebook,
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaWhatsapp,
};


// The names offered in the icon picker.
export const NAMED_ICONS = Object.keys(ICONS);


export const isIconUrl = (value) =>
    typeof value === "string" && /^https?:\/\//i.test(value);


export const resolveIcon = (name, fallback = Sparkles) =>
    ICONS[name] || fallback;
