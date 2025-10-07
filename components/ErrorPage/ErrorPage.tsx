"use client";

import { motion } from "framer-motion";
import { MdHome, MdRefresh } from "react-icons/md";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo/Logo";        // ← твій компонент лого (текст)
import css from "./ErrorPage.module.css";

type ErrorViewProps = {
  code?: number | string;
  title?: string;
  message?: string;
  homeHref?: string;
  reset?: () => void;
};

export default function ErrorView({
  code = 404,
  title = "Сторінку не знайдено",
  message = "Вибачте, сторінка недоступна чи переміщена.",
  homeHref = "/",
  reset,
}: ErrorViewProps) {
  const router = useRouter();
  const handleBack = () => router.push(homeHref);
  const handleRetry = () => { if (reset) reset(); };

  return (
    <div className={css.wrapper} role="alert" aria-live="polite">
      <motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        className={css.card}
      >
        {/* Лого-компонент зверху, як іконка */}
        <motion.div
          className={css.illu}
          initial={{ scale: 0.95, rotate: -2, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          aria-hidden="true"
        >
          <Logo className={css.logo} />
        </motion.div>

        <motion.h1
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className={css.code}
        >
          {code} — {title}
        </motion.h1>

        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className={css.message}
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className={css.actions}
        >
          <button className={`${css.button} ${css.primary}`} onClick={handleBack}>
            <MdHome size={20} />
            На головну
          </button>

          {reset && (
            <button className={`${css.button} ${css.ghost}`} onClick={handleRetry}>
              <MdRefresh size={20} />
              Спробувати ще раз
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
