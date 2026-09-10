import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";

import { usePortfolioContent } from "../content/usePortfolioContent";
import Editable from "../components/edit/Editable";
import EditableImage from "../components/edit/EditableImage";
import DragHandle from "../components/edit/DragHandle";
import { useSortable } from "../components/edit/useSortable";
import {
  ArchiveButton,
  CollectionControls,
} from "../components/edit/CollectionControls";

function Certificates() {
  const {
    content,
    updateItem,
    archiveItem,
    restoreItem,
    reorderItems,
    createItem,
  } = usePortfolioContent();
  const certificates = content.certificates;

  const sortable = useSortable(
    certificates.map((certificate) => certificate.id),
    (orderedIds) => reorderItems("certificates", orderedIds)
  );

  return (
    <section className="relative min-h-screen py-28 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="heading-font text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-[var(--accent)]">#</span>{" "}
            Certificates
          </h1>
          <div className="flex items-center gap-4">

            <div className="h-px w-10 bg-purple-500/40" />

            <span className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Credentials
            </span>
          </div>




          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Certifications and credentials earned through technical
            training, continuous learning, and professional development.
          </p>
        </div>

        {/* CERTIFICATE GRID */}
        <div className="grid gap-6 md:grid-cols-3">
          {certificates.map((certificate, index) => (
            <motion.article
              key={certificate.id || certificate.title}
              {...sortable.getItemProps(certificate.id)}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
              className={`group relative overflow-hidden border bg-[var(--card)]/70 backdrop-blur-xl transition ${
                sortable.overId === certificate.id
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/40"
                  : "border-[var(--border)]"
              } ${
                sortable.draggingId === certificate.id
                  ? "opacity-40"
                  : ""
              }`}
            >
              <ArchiveButton
                label={certificate.title}
                onArchive={() =>
                  archiveItem(
                    "certificates",
                    certificate.id
                  )
                }
              />

              <DragHandle
                {...sortable.dragHandleProps(certificate.id)}
                className="absolute left-2 top-2 z-10"
              />

              {/* CERTIFICATE IMAGE */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
                <EditableImage
                  uploadType="CERTIFICATE_IMAGE"
                  onUpload={(url) =>
                    updateItem("certificates", certificate.id, {
                      image: url,
                    })
                  }
                  className="absolute inset-0"
                >
                  <img
                    src={certificate.image}
                    alt={`${certificate.title} certificate`}
                    className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                  />
                </EditableImage>

                {/* Image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              </div>

              {/* INFO */}
              <div className="border-t border-[var(--border)] p-5">
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <Award
                        size={15}
                        className="shrink-0 text-purple-400"
                      />

                      <Editable
                        value={certificate.issuer}
                        onSave={(v) =>
                          updateItem(
                            "certificates",
                            certificate.id,
                            { issuer: v }
                          )
                        }
                        placeholder="Issuer"
                        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-400"
                      />
                    </div>

                    <Editable
                      as="h2"
                      value={certificate.title}
                      onSave={(v) =>
                        updateItem(
                          "certificates",
                          certificate.id,
                          { title: v }
                        )
                      }
                      className="heading-font block text-lg font-semibold leading-snug"
                    />
                  </div>

                  {/* VERIFY */}
                  <a
                    href={certificate.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${certificate.title}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--muted)] transition duration-300 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-400"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>

                <div className="mt-4 text-xs text-[var(--muted)]">
                  Verified credential
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <CollectionControls
          type="certificates"
          label="certificate"
          nameField="title"
          newItem={{
            title: "New certificate",
            issuer: "",
            verifyUrl: "",
            image: "",
          }}
          onAdd={createItem}
          onRestore={restoreItem}
        />

      </div>
    </section>
  );
}

export default Certificates;