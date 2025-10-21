"use client";

import css from "./CardsGrid.module.css";
import CamperCard from "@/components/CamperCard/CamperCard";
import type { Camper } from "@/lib/types/types";

type Props = {
  campers: Camper[];
  /** мапа улюблених: id -> true */
  favorites: Readonly<Record<string, boolean>>;
  onToggleFavorite: (id: string) => void;
  canLoadMore: boolean;
  onLoadMore: () => void;
  isFetching?: boolean;
};

export default function CardsGrid({
  campers,
  favorites,
  onToggleFavorite,
  canLoadMore,
  onLoadMore,
  isFetching = false,
}: Props) {
  return (
    <ul className={css.cards}>
      {campers.map((camper, i) => (
        <CamperCard
          key={camper.id}
          camper={camper}
          isFavorite={!!favorites[camper.id]}
          onToggleFavorite={onToggleFavorite}
          lcp={i === 0}
        />
      ))}

      {canLoadMore && (
        <button
          className={css.loadMore}
          onClick={onLoadMore}
          disabled={isFetching}
          aria-busy={isFetching}
        >
          {isFetching ? "Loading…" : "Load more"}
        </button>
      )}
    </ul>
  );
}
