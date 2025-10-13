import Link from "next/link";
import Image from "next/image";
import css from "./Hero.module.css";
import Container from "../Container/Container";

export default function Hero() {
  return (
    <section className={css.hero}>
      <Image
        src="/hero-van-1920.webp"
        alt="Camper at sunset by a lake"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        blurDataURL="/hero-van-blur-20.webp"
        className={css.bgImage}
      />

      <div className={css.overlay} />

      <Container>
        <div className={css.content}>
          <h1 className={css.title}>Campers of your dreams</h1>
          <p className={css.subtitle}>
            You can find everything you want in our catalog
          </p>
          <Link href="/catalog" className={css.button} prefetch={false}>
            View Now
          </Link>
        </div>
      </Container>
    </section>
  );
}
