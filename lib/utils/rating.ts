import type { UpstreamReview } from "@/types/types";

// Обчислення середнього рейтингу + кількість відгуків
export function getAverageRating(
  reviews: UpstreamReview[] | null | undefined,
  precision = 1
): { average: number; count: number } {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { average: 0, count: 0 };
  }

  // Лишаємо тільки коректні оцінки 1..5
  const ratings = reviews
    .map(r => r.reviewer_rating)
    .filter((n): n is number => Number.isFinite(n) && n >= 1 && n <= 5);

  if (ratings.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = ratings.reduce((acc, n) => acc + n, 0);
  const avg = sum / ratings.length;

  // Округлення з потрібною точністю (1 => 4.5; 2 => 4.52)
  const factor = 10 ** Math.max(0, precision);
  const average = Math.round(avg * factor) / factor;

  return { average, count: ratings.length };
}