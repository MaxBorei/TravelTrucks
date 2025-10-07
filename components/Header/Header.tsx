"use client";

import Container from "../Container/Container";
import Logo from "../Logo/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./Header.module.css";

export default function Header() {
  const pathname = usePathname(); 

  return (
    <header className={css.header}>
      <Container>
        <div className={css.inner}>
          <div className={css.logo}>
            <Logo />
          </div>
        </div>

        <nav>
          <ul className={css.navigation}>
            <li>
              <Link
                href="/"
                className={`${css.link} ${pathname === "/" ? css.active : ""}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className={`${css.link} ${pathname === "/catalog" ? css.active : ""}`}
              >
                Catalog
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
