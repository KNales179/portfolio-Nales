import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

function CertificateCard({ certificate, index = 0 }) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
      }}
      className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl"
    >
      {/* Credly Badge */}
      <div className="flex min-h-[380px] items-center justify-center bg-[var(--surface)]/30 p-6">
        <iframe
          src={certificate.embedUrl}
          title={certificate.title}
          loading="lazy"
          className="h-[360px] w-full max-w-[500px] border-0"
        />
      </div>

      {/* Information */}
      <div className="border-t border-[var(--border)] p-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">
          {certificate.issuer}
        </p>

        <h2 className="heading-font text-2xl font-bold">
          {certificate.title}
        </h2>

        <a
          href={certificate.embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-400 transition hover:text-purple-300"
        >
          View Credential
          <ExternalLink size={16} />
        </a>
      </div>
    </motion.article>
  );
}

export default CertificateCard;