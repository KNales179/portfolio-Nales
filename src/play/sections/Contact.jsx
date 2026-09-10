import { createElement } from "react";
import { ArrowUpRight } from "lucide-react";

import { resolveIcon } from "../../components/edit/iconMap";
import { trackLink } from "../../analytics/track";
import {
    PlaySection,
    Display,
    Kicker,
    Rule,
} from "./primitives";
import { panelStyle } from "./styles";


const onContactClick = (contact) => {
    trackLink(contact.href, contact.label);
};


// ============================================================
// CONTACT — panel  (minimalist)
// ============================================================

export function ContactPanel({ data }) {
    const { contacts } = data;

    return (
        <PlaySection id="play-contact">
            <div className="p-8 md:p-12" style={panelStyle}>
                <Kicker>Get in touch</Kicker>
                <Display
                    as="h2"
                    className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-4xl"
                >
                    Let&apos;s build something.
                </Display>

                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                    {contacts.map((contact, index) => (
                        <a
                            key={contact.id || index}
                            href={contact.href}
                            target={
                                contact.external
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                contact.external
                                    ? "noreferrer"
                                    : undefined
                            }
                            onClick={() =>
                                onContactClick(contact)
                            }
                            className="group flex items-center justify-between border px-4 py-3 transition hover:-translate-y-0.5"
                            style={{
                                borderColor:
                                    "var(--play-border)",
                                borderRadius:
                                    "var(--play-radius)",
                            }}
                        >
                            <span className="flex items-center gap-3">
                                <span
                                    className="flex h-8 w-8 items-center justify-center"
                                    style={{
                                        background:
                                            "color-mix(in srgb, var(--play-accent) 12%, transparent)",
                                        color: "var(--play-accent)",
                                    }}
                                >
                                    {createElement(
                                        resolveIcon(
                                            contact.icon,
                                            resolveIcon("Link")
                                        ),
                                        { size: 15 }
                                    )}
                                </span>
                                <span className="text-sm font-medium">
                                    {contact.label}
                                </span>
                            </span>
                            <ArrowUpRight
                                size={15}
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </PlaySection>
    );
}


// ============================================================
// CONTACT — colophon  (editorial)
// ============================================================

export function ContactColophon({ data }) {
    const { contacts, hero } = data;

    return (
        <PlaySection id="play-contact">
            <Rule />
            <div className="grid gap-10 pt-12 md:grid-cols-[1fr_2fr]">
                <div>
                    <Kicker>Colophon</Kicker>
                </div>

                <div>
                    <Display
                        as="p"
                        className="text-2xl leading-snug md:text-3xl"
                    >
                        This edition was set in{" "}
                        <em>Playfair Display</em> and{" "}
                        <em>Source Serif</em>. Written and
                        built by{" "}
                        <span
                            style={{
                                color: "var(--play-accent)",
                            }}
                        >
                            {hero.name}
                        </span>
                        .
                    </Display>

                    <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                        {contacts.map((contact, index) => (
                            <a
                                key={contact.id || index}
                                href={contact.href}
                                target={
                                    contact.external
                                        ? "_blank"
                                        : undefined
                                }
                                rel={
                                    contact.external
                                        ? "noreferrer"
                                        : undefined
                                }
                                onClick={() =>
                                    onContactClick(contact)
                                }
                                className="border-b-2 pb-0.5 text-sm font-semibold uppercase tracking-wider transition hover:opacity-60"
                                style={{
                                    borderColor:
                                        "var(--play-text)",
                                }}
                            >
                                {contact.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <Rule className="mt-16" />
            <p
                className="mt-6 text-center text-xs uppercase tracking-[0.28em]"
                style={{ color: "var(--play-muted)" }}
            >
                End of issue
            </p>
        </PlaySection>
    );
}
