import { lazy } from "react";

import {
    HeroCentered,
    HeroMasthead,
    HeroPrompt,
    HeroSlab,
    HeroGlitch,
    HeroChrome,
    HeroPane,
    HeroPrism,
    HeroClay,
    HeroBento,
    HeroMaxi,
    HeroAurora,
    HeroBlueprint,
    HeroVintage,
} from "./Hero";

// three.js is heavy — the galaxy hero (and three) load only when
// the Spatial preset is actually rendered.
const HeroGalaxy = lazy(() => import("./HeroGalaxy"));
import { AboutStacked, AboutLeadColumn } from "./About";
import { SkillsChips, SkillsIndex } from "./Skills";
import {
    ProjectsGrid,
    ProjectsFeature,
    ProjectsListing,
    ProjectsBlocks,
    ProjectsPanels,
    ProjectsArcade,
    ProjectsGlassCards,
    ProjectsHolo,
    ProjectsClay,
    ProjectsBento,
    ProjectsMaxi,
    ProjectsSoft,
    ProjectsBlueprint,
    ProjectsVintage,
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
    NavGlass,
    NavSpatial,
    NavHolo,
    NavClay,
    NavBento,
    NavMaxi,
    NavAurora,
    NavBlueprint,
    NavVintage,
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
        pane: HeroPane,
        galaxy: HeroGalaxy,
        prism: HeroPrism,
        clay: HeroClay,
        tile: HeroBento,
        maxi: HeroMaxi,
        aurora: HeroAurora,
        blueprint: HeroBlueprint,
        vintage: HeroVintage,
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
        glasscards: ProjectsGlassCards,
        holo: ProjectsHolo,
        clay: ProjectsClay,
        bento: ProjectsBento,
        maxi: ProjectsMaxi,
        soft: ProjectsSoft,
        blueprint: ProjectsBlueprint,
        vintage: ProjectsVintage,
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
    glass: NavGlass,
    spatial: NavSpatial,
    holo: NavHolo,
    clay: NavClay,
    bento: NavBento,
    maxi: NavMaxi,
    aurora: NavAurora,
    blueprint: NavBlueprint,
    vintage: NavVintage,
};
