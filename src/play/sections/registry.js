import {
    HeroCentered,
    HeroMasthead,
    HeroPrompt,
    HeroSlab,
    HeroGlitch,
    HeroChrome,
} from "./Hero";
import { AboutStacked, AboutLeadColumn } from "./About";
import { SkillsChips, SkillsIndex } from "./Skills";
import {
    ProjectsGrid,
    ProjectsFeature,
    ProjectsListing,
    ProjectsBlocks,
    ProjectsPanels,
    ProjectsArcade,
} from "./Projects";
import { JourneyTimeline, JourneyLedger } from "./Journey";
import {
    CertificatesPlates,
    CertificatesGallery,
} from "./Certificates";
import { HobbiesGrid, HobbiesMargin } from "./Hobbies";
import { ContactPanel, ContactColophon } from "./Contact";
import {
    NavMinimal,
    NavMasthead,
    NavTerminal,
    NavBrutal,
    NavCyber,
    NavSynth,
} from "./Nav";


// ============================================================
// SECTION + NAV VARIANT REGISTRY
// ============================================================
//
// A preset's `layout.variants` picks one component per section
// from here. Adding a variant = add the component + a key.
// ============================================================

export const SECTIONS = {
    hero: {
        centered: HeroCentered,
        masthead: HeroMasthead,
        prompt: HeroPrompt,
        slab: HeroSlab,
        glitch: HeroGlitch,
        chrome: HeroChrome,
    },
    about: {
        stacked: AboutStacked,
        leadcolumn: AboutLeadColumn,
    },
    skills: {
        chips: SkillsChips,
        index: SkillsIndex,
    },
    projects: {
        grid: ProjectsGrid,
        feature: ProjectsFeature,
        listing: ProjectsListing,
        blocks: ProjectsBlocks,
        panels: ProjectsPanels,
        arcade: ProjectsArcade,
    },
    journey: {
        timeline: JourneyTimeline,
        ledger: JourneyLedger,
    },
    certificates: {
        plates: CertificatesPlates,
        gallery: CertificatesGallery,
    },
    hobbies: {
        grid: HobbiesGrid,
        margin: HobbiesMargin,
    },
    contact: {
        panel: ContactPanel,
        colophon: ContactColophon,
    },
};

export const NAVS = {
    minimal: NavMinimal,
    editorial: NavMasthead,
    terminal: NavTerminal,
    brutal: NavBrutal,
    cyber: NavCyber,
    synth: NavSynth,
};
