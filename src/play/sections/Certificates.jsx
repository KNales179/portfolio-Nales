import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import {
    PlaySection,
    Display,
    Kicker,
    Rule,
} from "./primitives";
import { panelStyle } from "./styles";


// ============================================================
// CERTIFICATES — plates  (minimalist)
// ============================================================

export function CertificatesPlates({ data }) {
    const { certificates } = data;

    if (certificates.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-certificates">
            <Kicker>Credentials</Kicker>
            <Display
                as="h2"
                className="mt-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
                Certificates
            </Display>

            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                {certificates.map((certificate, index) => (
                    <motion.article
                        key={certificate.id || index}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.4,
                            delay: Math.min(index * 0.05, 0.3),
                        }}
                        className="flex h-full flex-col overflow-hidden"
                        style={panelStyle}
                    >
                        <div
                            className="aspect-[4/3] w-full overflow-hidden"
                            style={{
                                background:
                                    "var(--play-surface)",
                            }}
                        >
                            {certificate.image ? (
                                <img
                                    src={certificate.image}
                                    alt={certificate.title}
                                    className="h-full w-full object-contain p-3"
                                />
                            ) : null}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                            <p
                                className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                                style={{
                                    color: "var(--play-accent)",
                                }}
                            >
                                {certificate.issuer}
                            </p>
                            <Display
                                as="h3"
                                className="mt-1.5 text-base font-bold leading-snug"
                            >
                                {certificate.title}
                            </Display>

                            {certificate.verifyUrl && (
                                <a
                                    href={
                                        certificate.verifyUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold transition hover:opacity-70"
                                    style={{
                                        color: "var(--play-accent)",
                                    }}
                                >
                                    Verify
                                    <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    </motion.article>
                ))}
            </div>
        </PlaySection>
    );
}


// ============================================================
// CERTIFICATES — gallery  (editorial)
// ============================================================

export function CertificatesGallery({ data }) {
    const { certificates } = data;

    if (certificates.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-certificates">
            <Rule />
            <p
                className="mt-6 text-xs uppercase tracking-[0.28em]"
                style={{ color: "var(--play-muted)" }}
            >
                Credentials on file
            </p>

            <div className="mt-8 grid gap-x-10 gap-y-14 md:grid-cols-2">
                {certificates.map((certificate, index) => (
                    <motion.figure
                        key={certificate.id || index}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45 }}
                    >
                        <div
                            className="aspect-[4/3] w-full overflow-hidden border"
                            style={{
                                borderColor:
                                    "var(--play-border)",
                                background:
                                    "var(--play-surface)",
                            }}
                        >
                            {certificate.image ? (
                                <img
                                    src={certificate.image}
                                    alt={certificate.title}
                                    className="h-full w-full object-contain p-4"
                                />
                            ) : null}
                        </div>

                        <figcaption className="mt-3">
                            <Display
                                as="p"
                                className="text-xl font-semibold"
                            >
                                {certificate.title}
                            </Display>
                            <p
                                className="text-sm italic"
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                {certificate.issuer}
                                {certificate.verifyUrl && (
                                    <>
                                        {" — "}
                                        <a
                                            href={
                                                certificate.verifyUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="not-italic underline transition hover:opacity-70"
                                        >
                                            verify
                                        </a>
                                    </>
                                )}
                            </p>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        </PlaySection>
    );
}
