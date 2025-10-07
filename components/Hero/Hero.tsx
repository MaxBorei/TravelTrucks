import Image from "next/image";
import Link from "next/link";
import css from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={css.hero}>
      <Image
        src="/Picture.jpg"
        alt="Camper van at sunset"
        width={1440}
        height={696}
        className={css.image}
        priority
      />

      <div className={css.content}>
        <h1 className={css.title}>Campers of your dreams</h1>
        <p className={css.subtitle}>
          You can find everything you want in our catalog
        </p>
        <Link href="/catalog" className={css.button}>
          View Now
        </Link>
      </div>
    </section>
  );
}
