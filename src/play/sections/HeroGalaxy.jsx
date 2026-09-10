import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import * as THREE from "three";

import { trackInteraction } from "../../analytics/track";


// ============================================================
// HERO — galaxy  (spatial preset)
// ============================================================
//
// A hand-rolled WebGL scene: a spiral point-cloud galaxy that
// slowly turns, ringed by "project stars". Drag to orbit the
// camera, scroll to zoom, hover a star for its name, click to
// open it. No react-three-fiber — plain three.js in an effect.
// ============================================================

const GALAXY_POINTS = 14000;
const GALAXY_RADIUS = 64;
const ARMS = 4;

// Rich nebula palette (kept independent of the token accents so
// the clouds always look like deep space).
const NEBULA_COLORS = [
    0x3a1f6e, // indigo
    0x6d2f8f, // violet
    0xb23a8a, // magenta
    0x2a4bb0, // blue
    0x1f7a86, // teal
    0x7c3fd6, // amethyst
];

const hexToColor = (hex) => new THREE.Color(hex || "#7ba4ff");

const projectSlug = (name) =>
    String(name || "").toLowerCase().replace(/\s+/g, "-");

const projectHref = (project) =>
    project.liveLink ||
    project.demoLink ||
    project.github ||
    null;


function HeroGalaxy({ data }) {
    const { hero, projects, loading } = data;

    const mountRef = useRef(null);
    const [hovered, setHovered] = useState(null);
    const [heroImage, setHeroImage] = useState("none");

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount || loading) {
            return undefined;
        }

        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Lighter particle budget on phones.
        const small = mount.clientWidth < 700;
        const galaxyPoints = small ? 6000 : GALAXY_POINTS;
        const starCount = small ? 1500 : 3200;

        const accent = hexToColor(
            getVar(mount, "--play-accent") || "#7ba4ff"
        );
        const accent2 = hexToColor(
            getVar(mount, "--play-accent-2") || "#c88bff"
        );

        // Optional nebula photo backdrop — when set, draw only
        // the interactive particle layer on top of it.
        const imageVar = getVar(mount, "--play-hero-image");
        const hasImage =
            imageVar && imageVar !== "none";
        setHeroImage(hasImage ? imageVar : "none");

        // --- renderer / scene / camera ---------------------
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 2)
        );
        renderer.setSize(
            mount.clientWidth,
            mount.clientHeight
        );
        renderer.setClearColor(
            0x000005,
            hasImage ? 0 : 1
        );
        renderer.domElement.style.touchAction = "pan-y";
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000005, 0.0045);

        const camera = new THREE.PerspectiveCamera(
            52,
            mount.clientWidth / mount.clientHeight,
            0.1,
            4000
        );

        // Everything that belongs to "the galaxy" — offset up
        // so it reads in the upper part of the frame with black
        // space beneath the overlay text.
        const GALAXY_LIFT = 16;
        const world = new THREE.Group();
        world.position.y = GALAXY_LIFT;
        world.rotation.x = -0.95;
        scene.add(world);

        const dotTexture = makeGlowTexture(false);
        const cloudTexture = makeGlowTexture(true);

        // --- distant background starfield -----------------
        const STAR_COUNT = starCount;
        const starPos = new Float32Array(STAR_COUNT * 3);
        const starCol = new Float32Array(STAR_COUNT * 3);
        for (let i = 0; i < STAR_COUNT; i += 1) {
            starPos[i * 3] = (Math.random() - 0.5) * 1100;
            starPos[i * 3 + 1] = (Math.random() - 0.5) * 1100;
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 1100;
            // mostly faint, a few bright
            const bright =
                Math.random() < 0.06
                    ? 1
                    : 0.25 + Math.random() * 0.4;
            starCol[i * 3] = bright * 0.92;
            starCol[i * 3 + 1] = bright * 0.95;
            starCol[i * 3 + 2] = bright;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute(
            "position",
            new THREE.BufferAttribute(starPos, 3)
        );
        starGeo.setAttribute(
            "color",
            new THREE.BufferAttribute(starCol, 3)
        );
        const starfield = new THREE.Points(
            starGeo,
            new THREE.PointsMaterial({
                size: 2.4,
                map: dotTexture,
                vertexColors: true,
                transparent: true,
                opacity: 0.95,
                depthWrite: false,
                sizeAttenuation: true,
            })
        );
        scene.add(starfield);

        // --- nebula clouds -------------------------------
        // Big, faint, drifting colour fields — the "aura".
        // Skipped when a photo backdrop supplies the nebula.
        const clouds = [];
        const addGlow = (color, scale, opacity) => {
            const sprite = new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: cloudTexture,
                    color,
                    transparent: true,
                    opacity,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                })
            );
            sprite.scale.set(scale, scale, 1);
            return sprite;
        };

        if (!hasImage) {
            for (let i = 0; i < 9; i += 1) {
                const sprite = new THREE.Sprite(
                    new THREE.SpriteMaterial({
                        map: cloudTexture,
                        color: NEBULA_COLORS[
                            i % NEBULA_COLORS.length
                        ],
                        transparent: true,
                        opacity:
                            0.16 + Math.random() * 0.14,
                        depthWrite: false,
                        blending: THREE.AdditiveBlending,
                    })
                );
                const a = Math.random() * Math.PI * 2;
                const r =
                    Math.random() * GALAXY_RADIUS * 0.9;
                sprite.position.set(
                    Math.cos(a) * r,
                    (Math.random() - 0.5) * 14,
                    Math.sin(a) * r
                );
                const s =
                    GALAXY_RADIUS *
                    (1.1 + Math.random() * 1.6);
                sprite.scale.set(s, s, 1);
                sprite.userData = {
                    base: sprite.position.clone(),
                    phase: Math.random() * 10,
                    drift: 6 + Math.random() * 8,
                };
                world.add(sprite);
                clouds.push(sprite);
            }

            world.add(
                addGlow(0x5b47b0, GALAXY_RADIUS * 3.2, 0.35)
            );
            world.add(
                addGlow(0x8fa0ff, GALAXY_RADIUS * 1.5, 0.4)
            );
            world.add(
                addGlow(
                    0xfff2e2,
                    GALAXY_RADIUS * 0.55,
                    0.55
                )
            );
        }

        // --- galaxy point cloud ---------------------------
        const positions = new Float32Array(
            galaxyPoints * 3
        );
        const colors = new Float32Array(galaxyPoints * 3);

        const armColor = accent
            .clone()
            .lerp(new THREE.Color(0xff9ecb), 0.35);

        for (let i = 0; i < galaxyPoints; i += 1) {
            const radius =
                Math.pow(Math.random(), 0.55) * GALAXY_RADIUS;
            const arm = i % ARMS;
            const branch =
                (arm / ARMS) * Math.PI * 2 + radius * 0.16;
            const spread =
                Math.pow(Math.random(), 2.2) *
                (0.35 + radius * 0.014) *
                (Math.random() < 0.5 ? 1 : -1);

            positions[i * 3] =
                Math.cos(branch + spread) * radius +
                (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] =
                (Math.random() - 0.5) *
                Math.max(0.8, 4.5 - radius * 0.055);
            positions[i * 3 + 2] =
                Math.sin(branch + spread) * radius +
                (Math.random() - 0.5) * 2;

            const mix = radius / GALAXY_RADIUS;
            const color = new THREE.Color(0xfff4e8)
                .lerp(armColor, Math.min(1, mix * 1.3))
                .lerp(accent2, Math.max(0, mix - 0.55) * 1.6)
                .multiplyScalar(0.7 + Math.random() * 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const galaxyGeo = new THREE.BufferGeometry();
        galaxyGeo.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
        galaxyGeo.setAttribute(
            "color",
            new THREE.BufferAttribute(colors, 3)
        );

        const galaxy = new THREE.Points(
            galaxyGeo,
            new THREE.PointsMaterial({
                size: hasImage ? 1.0 : 1.4,
                map: dotTexture,
                vertexColors: true,
                transparent: true,
                opacity: hasImage ? 0.55 : 0.9,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true,
            })
        );
        world.add(galaxy);

        const auraTexture = cloudTexture;

        // --- project stars -------------------------------
        const starGroup = new THREE.Group();
        const starMeshes = [];
        const list = projects || [];

        list.forEach((project, index) => {
            const angle =
                (index / Math.max(list.length, 1)) *
                    Math.PI *
                    2 +
                0.4;
            const dist = 26 + (index % 3) * 6;

            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(1.5, 18, 18),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                })
            );
            mesh.position.set(
                Math.cos(angle) * dist,
                (Math.random() - 0.5) * 3,
                Math.sin(angle) * dist
            );
            mesh.userData = { project, index };

            const halo = new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: auraTexture,
                    color: accent,
                    transparent: true,
                    opacity: 0.7,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                })
            );
            halo.scale.set(9, 9, 1);
            mesh.add(halo);

            starGroup.add(mesh);
            starMeshes.push(mesh);
        });
        world.add(starGroup);

        // --- raycasting ----------------------------------
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(-2, -2);

        const pick = () => {
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(
                starMeshes,
                false
            );
            return hits.length ? hits[0].object : null;
        };

        // --- orbit + zoom controls ------------------------
        let theta = 0.5;
        let phi = 0.32;
        let targetTheta = 0.5;
        let targetPhi = 0.32;
        let radius = 108;
        let targetRadius = 108;
        let dragging = false;
        let lastX = 0;
        let lastY = 0;

        const el = renderer.domElement;

        const onDown = (event) => {
            dragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
        };
        const onUp = () => {
            dragging = false;
        };
        const onMove = (event) => {
            const rect = el.getBoundingClientRect();
            pointer.x =
                ((event.clientX - rect.left) / rect.width) *
                    2 -
                1;
            pointer.y =
                -((event.clientY - rect.top) / rect.height) *
                    2 +
                1;

            if (dragging) {
                targetTheta -=
                    (event.clientX - lastX) * 0.005;
                targetPhi = clamp(
                    targetPhi +
                        (event.clientY - lastY) * 0.005,
                    0.08,
                    1.3
                );
                lastX = event.clientX;
                lastY = event.clientY;
            }
        };
        const onClick = () => {
            const hit = pick();
            if (hit) {
                const project = hit.userData.project;
                trackInteraction(
                    "PROJECT_OPENED",
                    project.name
                );
                const href = projectHref(project);
                if (href) {
                    window.open(
                        href,
                        "_blank",
                        "noopener,noreferrer"
                    );
                }
            }
        };

        el.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointermove", onMove);
        el.addEventListener("click", onClick);

        let hoveredMesh = null;

        // --- resize --------------------------------------
        const onResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        // --- loop ---------------------------------------
        let raf = 0;
        let running = true;

        const tick = (now) => {
            if (!running) {
                return;
            }

            theta += (targetTheta - theta) * 0.06;
            phi += (targetPhi - phi) * 0.06;
            radius += (targetRadius - radius) * 0.06;

            if (!reduce) {
                galaxy.rotation.y += 0.0004;
                starGroup.rotation.y += 0.0004;
                starfield.rotation.y += 0.00005;

                const ts = (now || 0) * 0.001;
                for (const c of clouds) {
                    const u = c.userData;
                    c.position.x =
                        u.base.x +
                        Math.sin(ts * 0.15 + u.phase) *
                            u.drift;
                    c.position.z =
                        u.base.z +
                        Math.cos(ts * 0.12 + u.phase) *
                            u.drift;
                    c.material.rotation += 0.0006;
                }
            }

            camera.position.set(
                Math.sin(theta) * Math.cos(phi) * radius,
                Math.sin(phi) * radius,
                Math.cos(theta) * Math.cos(phi) * radius
            );
            camera.lookAt(0, 6, 0);

            const hit = pick();
            if (hit !== hoveredMesh) {
                if (hoveredMesh) {
                    hoveredMesh.scale.setScalar(1);
                }
                hoveredMesh = hit;
                if (hit) {
                    hit.scale.setScalar(1.6);
                }
                el.style.cursor = hit
                    ? "pointer"
                    : dragging
                    ? "grabbing"
                    : "grab";
                setHovered(
                    hit ? hit.userData.project : null
                );
            }

            renderer.render(scene, camera);
            raf = requestAnimationFrame(tick);
        };

        const onVisibility = () => {
            running = document.visibilityState === "visible";
            if (running) {
                raf = requestAnimationFrame(tick);
            }
        };
        document.addEventListener(
            "visibilitychange",
            onVisibility
        );

        tick();

        // --- cleanup ------------------------------------
        return () => {
            running = false;
            cancelAnimationFrame(raf);

            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener(
                "visibilitychange",
                onVisibility
            );
            el.removeEventListener("pointerdown", onDown);
            el.removeEventListener("click", onClick);

            scene.traverse((obj) => {
                if (obj.geometry) {
                    obj.geometry.dispose();
                }
                if (obj.material) {
                    obj.material.dispose();
                }
            });
            dotTexture.dispose();
            cloudTexture.dispose();
            renderer.dispose();
            if (el.parentNode === mount) {
                mount.removeChild(el);
            }
        };
        // Rebuild the scene once content is ready (and if it
        // ever changes). `projects` from usePlayContent is a
        // stable reference between renders.
    }, [loading, projects]);

    const withImage = heroImage && heroImage !== "none";

    return (
        <section
            id="play-hero"
            className="relative h-screen w-full overflow-hidden bg-cover bg-center"
            style={{
                backgroundColor: "var(--play-bg)",
                backgroundImage: withImage
                    ? heroImage
                    : undefined,
            }}
        >
            <div
                ref={mountRef}
                className="absolute inset-0"
                style={{ touchAction: "pan-y" }}
            />

            {/* colour grade — vignette + horizon wash so the
                canvas edges melt into the page like the reference */}
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background: withImage
                        ? "radial-gradient(130% 100% at 60% 32%, transparent 0%, transparent 52%, rgba(3,4,12,0.35) 82%, rgba(3,4,12,0.82) 100%), linear-gradient(180deg, rgba(3,4,12,0.15) 0%, transparent 34%, transparent 58%, rgba(3,4,12,0.92) 100%)"
                        : "radial-gradient(120% 90% at 62% 34%, transparent 0%, transparent 42%, rgba(3,4,12,0.55) 78%, rgba(3,4,12,0.95) 100%), linear-gradient(180deg, rgba(20,10,45,0.35) 0%, transparent 30%, transparent 62%, rgba(3,4,12,0.9) 100%)",
                }}
            />

            {/* overlay */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-6 py-24 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p
                        className="text-xs font-semibold uppercase tracking-[0.34em]"
                        style={{ color: "var(--play-accent)" }}
                    >
                        {hero.greeting}
                    </p>
                    <h1
                        className="mt-3 text-5xl font-bold tracking-tight md:text-7xl"
                        style={{
                            fontFamily:
                                "var(--play-font-head)",
                            textShadow:
                                "0 0 28px rgba(123,164,255,0.5), 0 2px 14px rgba(0,0,0,0.85)",
                        }}
                    >
                        {hero.name}
                    </h1>
                    <p
                        className="mt-2 max-w-md text-lg"
                        style={{
                            color: "#c7cff0",
                            textShadow:
                                "0 1px 10px rgba(0,0,0,0.8)",
                        }}
                    >
                        {hero.role}
                    </p>
                </motion.div>

                <div
                    className="flex items-end justify-between text-xs"
                    style={{ color: "var(--play-muted)" }}
                >
                    <span>
                        drag to orbit · click a star to open
                    </span>
                    <button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById(
                                    "play-projects"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                        className="pointer-events-auto inline-flex items-center gap-1.5"
                    >
                        Continue
                        <ArrowDown size={14} />
                    </button>
                </div>
            </div>

            {/* hovered star label */}
            {hovered && (
                <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2">
                    <div
                        className="border px-4 py-2 text-center text-sm shadow-lg"
                        style={{
                            borderColor: "var(--play-border)",
                            background: "var(--play-card)",
                            backdropFilter: "var(--play-blur)",
                            WebkitBackdropFilter:
                                "var(--play-blur)",
                            color: "var(--play-text)",
                            borderRadius: "var(--play-radius)",
                        }}
                    >
                        <span className="font-semibold">
                            {hovered.name}
                        </span>
                        <span
                            className="ml-2 text-xs"
                            style={{
                                color: "var(--play-muted)",
                            }}
                        >
                            {projectHref(hovered)
                                ? "click to open"
                                : projectSlug(hovered.type)}
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
}


function getVar(el, name) {
    return getComputedStyle(el)
        .getPropertyValue(name)
        .trim();
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// A soft radial-gradient sprite texture. `soft` = a very gradual
// wispy falloff for the nebula clouds; the default is a tighter
// dot for particles and star halos.
function makeGlowTexture(soft = false) {
    const size = 160;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
    );
    if (soft) {
        g.addColorStop(0, "rgba(255,255,255,0.5)");
        g.addColorStop(0.4, "rgba(255,255,255,0.16)");
        g.addColorStop(0.75, "rgba(255,255,255,0.04)");
        g.addColorStop(1, "rgba(255,255,255,0)");
    } else {
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.18, "rgba(255,255,255,0.85)");
        g.addColorStop(0.45, "rgba(255,255,255,0.28)");
        g.addColorStop(1, "rgba(255,255,255,0)");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

export default HeroGalaxy;
