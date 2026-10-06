import { motion, useScroll, useSpring } from "motion/react";

/** Fine barre degradee en haut de l'ecran, indiquant la progression de lecture. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#103d34] via-[#1b5e52] to-[#2dd4bf] shadow-[0_0_12px_rgba(45,212,191,0.6)]"
    />
  );
}
