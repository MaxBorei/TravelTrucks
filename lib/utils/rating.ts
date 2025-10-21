import type { UpstreamReview } from "@/lib/types/types";

// Середній рейтинг + кількість відгуків (вже є)
export function getAverageRating(
  reviews: UpstreamReview[] | null | undefined,
  precision = 1
): { average: number; count: number } {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const ratings = reviews
    .map((r) => r.reviewer_rating)
    .filter((n): n is number => Number.isFinite(n) && n >= 1 && n <= 5);

  if (ratings.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = ratings.reduce((acc, n) => acc + n, 0);
  const avg = sum / ratings.length;

  const factor = 10 ** Math.max(0, precision);
  const average = Math.round(avg * factor) / factor;

  return { average, count: ratings.length };
}

/** Округлення до довільного кроку (за замовч. 0.5) у межах 0..5 */
export function roundToStep(value: number, step = 0.5): number {
  const s = Math.max(0.01, step); // захист від 0
  const rounded = Math.round(value / s) * s;
  return Math.max(0, Math.min(5, Number(rounded.toFixed(2))));
}

/** Зручний хелпер: середній рейтинг, округлений до кроку (0.5 за замовч.) */
export function getAverageRatingRounded(
  reviews: UpstreamReview[] | null | undefined,
  step = 0.5
): { average: number; count: number } {
  const { average, count } = getAverageRating(reviews, 3);
  return { average: roundToStep(average, step), count };
}

/**
 * Масив заповнення зірок (0..1 на зірку).
 * Напр., value=3.5, outOf=5 -> [1,1,1,0.5,0]
 */
export function starFills(value: number, outOf = 5): number[] {
  const v = Math.max(0, Math.min(value, outOf));
  return Array.from({ length: outOf }, (_, i) => {
    const diff = v - i;
    if (diff >= 1) return 1;
    if (diff <= 0) return 0;
    return Number(diff.toFixed(2)); // частка для цієї зірки
  });
}
