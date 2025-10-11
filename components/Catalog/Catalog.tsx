"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Container from "../Container/Container";
import Loader from "../Loader/Loader";
import ErrorPage from "../ErrorPage/ErrorPage";
import css from "./Catalog.module.css";

import { useNoteStore } from "@/lib/stores/noteStore";
import FiltersSidebar from "../FiltersSidebar/FiltersSidebar";
import CardsGrid from "../CardsGrid/CardsGrid";

import { useCatalogFiltersSync } from "@/lib/hooks/useCatalogFiltersSync";
import { useCampersQuery } from "@/lib/hooks/useCampersQuery";

export default function Catalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ===== Zustand
  const filtersApplied = useNoteStore((s) => s.filtersApplied);
  const applyFilters = useNoteStore((s) => s.applyFilters);
  const resetFilters = useNoteStore((s) => s.resetFilters);
  const toggleFavorite = useNoteStore((s) => s.toggleFavorite);
  const favorites = useNoteStore((s) => s.favorites);

  // ===== Пагинация (в урле "page" читаем один раз, остальное — в хук)
  const initialPage = (() => {
    const p = Number(searchParams.get("page") ?? "1");
    return Number.isFinite(p) && p > 0 ? p : 1;
  })();
  const [page, setPage] = useState<number>(initialPage);
  const limit = 4;

  // ===== Синхронизация фильтров с URL (draft ↔ URL, гидратации)
  useCatalogFiltersSync(limit, page);

  // ===== Данные каталога + аккумулирование
  const {
    campers,
    canLoadMore,
    loadMore,
    isLoading,
    isError,
    isFetching,
    resetAcc,
  } = useCampersQuery(filtersApplied, page, setPage, limit);

  // ---- Действия ----
  const onApply = () => {
    setPage(1);
    resetAcc();
    applyFilters();
  };

  const onReset = () => {
    resetFilters();
    setPage(1);
    resetAcc();
    router.replace(pathname, { scroll: false });
  };

  if (isLoading && !campers.length) return <Loader />;
  if (isError) return <ErrorPage />;

  return (
    <Container>
      <section className={css.catalog}>
        <FiltersSidebar onApply={onApply} onReset={onReset} />

        <CardsGrid
          campers={campers}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          canLoadMore={canLoadMore}
          onLoadMore={loadMore}
          isFetching={isFetching}
        />
      </section>
    </Container>
  );
}
