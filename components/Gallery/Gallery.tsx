"use client";

import Image from "next/image";
import type { Camper } from "@/lib/types/types";
import css from "./Gallery.module.css";

type Props = { camper: Camper };

export default function Gallery({ camper }: Props) {
  const first = camper.gallery?.[0];
  const src = first?.original || first?.thumb || "/Picture.jpg";

  return (
    <div className={css.root}>
      <Image
        className={css.main}
        src={src}
        alt={camper.name}
        width={888}
        height={380}
      />
      <div className={css.thumbs}>
        {(camper.gallery ?? []).slice(1, 4).map((g, idx) => (
          <Image
            key={idx}
            className={css.thumb}
            src={g.thumb || g.original || "/Picture.jpg"}
            alt={`${camper.name} ${idx + 1}`}
            width={280}
            height={180}
          />
        ))}
      </div>
    </div>
  );
}
