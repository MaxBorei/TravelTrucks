"use client";

import { useEffect, useRef, useState } from "react";
import css from "./EvasiveDiscountButton.module.css";

type Props = {
  anchorRef?: React.RefObject<HTMLElement>;
  label?: string;
  radiusPx?: number;
  minStepPx?: number;
};

export default function EvasiveDiscountButtonGlobal({
  anchorRef,
  label = "Натисніть — 90% знижки!",
  radiusPx = 140,
  minStepPx = 120,
}: Props) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: 40,
    top: 40,
  });

  // стартує біля форми
  useEffect(() => {
    const place = () => {
      const btn = btnRef.current;
      const an = anchorRef?.current;
      if (!btn) return;
      const vw = window.innerWidth,
        vh = window.innerHeight;
      const bw = btn.offsetWidth || 166,
        bh = btn.offsetHeight || 56;

      if (an) {
        const r = an.getBoundingClientRect();
        const left = clamp(r.right + 12, 0, vw - bw);
        const top = clamp(r.bottom - bh, 0, vh - bh);
        setPos({ left, top });
      } else {
        setPos({
          left: Math.max(0, (vw - bw) / 2),
          top: Math.max(0, (vh - bh) / 2),
        });
      }
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [anchorRef]);

  // тікає від курсора по всьому екрану
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const bx = pos.left + btn.offsetWidth / 2;
      const by = pos.top + btn.offsetHeight / 2;
      const dx = e.clientX - bx;
      const dy = e.clientY - by;
      const dist = Math.hypot(dx, dy);

      if (dist < radiusPx) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const vw = window.innerWidth,
            vh = window.innerHeight;
          const bw = btn.offsetWidth,
            bh = btn.offsetHeight;
          const awayX = bx - (dx / (dist || 1)) * (radiusPx + minStepPx);
          const awayY = by - (dy / (dist || 1)) * (radiusPx + minStepPx);

          let left = clamp(awayX - bw / 2 + rand(-40, 40), 0, vw - bw);
          let top = clamp(awayY - bh / 2 + rand(-40, 40), 0, vh - bh);

          if (Math.hypot(left - pos.left, top - pos.top) < 20) {
            left = clamp(rand(0, vw - bw), 0, vw - bw);
            top = clamp(rand(0, vh - bh), 0, vh - bh);
          }
          setPos({ left, top });
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [pos, radiusPx, minStepPx]);

  const onFocus = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const vw = window.innerWidth,
      vh = window.innerHeight;
    const bw = btn.offsetWidth,
      bh = btn.offsetHeight;
    setPos({
      left: clamp(rand(0, vw - bw), 0, vw - bw),
      top: clamp(rand(0, vh - bh), 0, vh - bh),
    });
  };

  return (
    <button
      ref={btnRef}
      type="button"
      className={css.btn}
      style={{ left: pos.left, top: pos.top }}
      onFocus={onFocus}
      onClick={(e) => {
        e.preventDefault();
        alert("Ой! Знижка втекла 😅");
      }}
    >
      {label}
    </button>
  );
}

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const rand = (a: number, b: number) => Math.random() * (b - a) + a;
