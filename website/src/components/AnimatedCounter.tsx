import { useEffect, useRef, useState } from "react";

interface Props {
  /** Final value to count to. */
  to: number;
  /** Optional prefix (e.g. "$"). */
  prefix?: string;
  /** Optional suffix (e.g. "%", "k+"). */
  suffix?: string;
  /** Decimal places. */
  decimals?: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Use thousands separators. */
  separator?: boolean;
  /** Additional className for the wrapping span. */
  className?: string;
}

/**
 * Counts up from 0 → `to` once the element scrolls into view.
 * Respects `prefers-reduced-motion` (jumps straight to final value).
 */
export default function AnimatedCounter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  separator = true,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Honor reduced motion — show the final value immediately.
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      setPlayed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !played) {
            setPlayed(true);
            const start = performance.now();
            const tick = (now: number) => {
              const elapsed = now - start;
              const t = Math.min(1, elapsed / duration);
              // Ease-out cubic for natural deceleration.
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(eased * to);
              if (t < 1) requestAnimationFrame(tick);
              else setValue(to);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, played]);

  const display = (() => {
    const fixed = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    if (!separator) return fixed;
    const [whole, dec] = fixed.split(".");
    const w = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return dec !== undefined ? `${w}.${dec}` : w;
  })();

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
