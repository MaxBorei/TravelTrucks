import React from "react";
import css from "./StarFills.module.css";

type Props = {
  value: number;
  outOf?: number;
  size?: number;
  spriteUrl?: string;
  symbolId?: string;
  filledColor?: string;
  emptyColor?: string;
};

type Vars = React.CSSProperties & {
  ["--size"]?: string;
  ["--filled"]?: string;
  ["--empty"]?: string;
  ["--fill"]?: string;
};

export default function StarRatingSprite({
  value,
  outOf = 5,
  size = 18,
  spriteUrl = "/sprite.svg",
  symbolId = "icon-Rating-star",
  filledColor = "#FFC531",
  emptyColor = "#F2F4F7",
}: Props) {
  const v = Math.max(0, Math.min(value, outOf));
  const full = Math.floor(v);
  const frac = v - full;
  const href = `${spriteUrl}#${symbolId}`;

  const cell = (fill: number, key: number) => {
    const vars: Vars = {
      "--size": `${size}px`,
      "--filled": filledColor,
      "--empty": emptyColor,
      "--fill": `${Math.round(fill * 100)}%`,
    };
    return (
      <span className={css.cell} style={vars} key={key}>
        {/* нижній шар — порожня зірка */}
        <svg
          className={`${css.icon} ${css.base}`}
          viewBox="0 0 34 32"
          aria-hidden="true"
        >
          <use href={href} />
        </svg>
        {/* верхній шар — заповнена зірка, обрізана по ширині */}
        <span className={css.overlay}>
          <svg
            className={`${css.icon} ${css.filled}`}
            viewBox="0 0 34 32"
            aria-hidden="true"
          >
            <use href={href} />
          </svg>
        </span>
      </span>
    );
  };

  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < full; i++) nodes.push(cell(1, i));
  if (frac > 0 && nodes.length < outOf) nodes.push(cell(frac, nodes.length));
  while (nodes.length < outOf) nodes.push(cell(0, nodes.length));

  return (
    <span className={css.row} role="img" aria-label={`${v} out of ${outOf}`}>
      {nodes}
    </span>
  );
}
