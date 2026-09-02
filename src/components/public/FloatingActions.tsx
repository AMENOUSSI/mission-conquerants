"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowUp, WhatsappLogo } from "@phosphor-icons/react";
import { whatsappLink } from "@/lib/format";

const SCROLL_THRESHOLD = 480;
const WHATSAPP_MESSAGE = "Bonjour, je vous contacte depuis le site de Mission Les Conquérants.";

/**
 * Fixed bottom-right stack: WhatsApp deep link (when settings provide a
 * number) plus a back-to-top button that appears once the visitor has
 * scrolled past the hero. Owning both in one component keeps them from
 * overlapping regardless of which one is visible.
 */
export function FloatingActions({ whatsappNumber }: { whatsappNumber: string | null }) {
  const [showTop, setShowTop] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowTop(latest > SCROLL_THRESHOLD);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  const waHref = whatsappNumber ? whatsappLink(whatsappNumber, WHATSAPP_MESSAGE) : null;

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Revenir en haut de la page"
            initial={reduce ? false : { opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90 active:translate-y-px"
          >
            <ArrowUp size={20} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>

      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Discuter sur WhatsApp"
          className="flex size-12 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-lg transition-transform hover:scale-105 active:translate-y-px active:scale-100"
        >
          <WhatsappLogo size={26} weight="fill" />
        </a>
      )}
    </div>
  );
}
