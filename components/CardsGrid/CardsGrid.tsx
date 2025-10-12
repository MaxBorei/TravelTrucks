"use client";

import css from "./CardsGrid.module.css";
import CamperCard from "@/components/CamperCard/CamperCard";
import type { Camper } from "@/types/types";

type Props = {
  campers: Camper[];
  favorites: Record<string, true> | Record<string, boolean>;
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
    <div className={css.cards}>
      {campers.map((camper) => (
        <CamperCard
          key={camper.id}
          camper={camper}
          isFavorite={Boolean(
            (favorites as Record<string, boolean>)[camper.id]
          )}
          onToggleFavorite={onToggleFavorite}
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
    </div>
  );
}
