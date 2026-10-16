import React from "react";

interface BorderBeamProps {
  className?: string;
  /** Cote du carre parcouru par le faisceau, en pixels. */
  size?: number;
  /** Duree d'un tour complet, en secondes. */
  duration?: number;
  borderWidth?: number;
  /** 0 = bord gauche du cadre, 100 = bord droit. */
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

/**
 * Cadre degrade anime. A poser sur tout conteneur `position: relative`
 * (avec `overflow-hidden` et le meme `border-radius`) pour obtenir une
 * lumiere qui parcourt les aretes.
 */
export function BorderBeam({
  className = "",
  size = 200,
  duration = 12,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#1b5e52",
  colorTo = "#2dd4bf",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] ![mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:[animation:border-beam_calc(var(--duration)*1s)_infinite_linear] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] ${className}`}
    />
  );
}
