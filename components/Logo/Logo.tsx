import Link from "next/link";
import clsx from "clsx";
import css from "./Logo.module.css";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="TravelTrucks — Home"
      className={clsx(css.logo, className)}
      prefetch={false}
    >
      <span className={css.partA}>Travel</span>
      <span className={css.partB}>Trucks</span>
    </Link>
  );
}
