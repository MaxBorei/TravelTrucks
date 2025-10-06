"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Container from "../Container/Container";
import Logo from "../Logo/Logo";
import css from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className={css.header}>
      <Container className={css.inner}>
        <div className={css.brand}>
          <Logo />
        </div>

        <nav aria-label="Main navigation">
          <ul className={css.navigation}>
            <li>
              <Link
                href="/"
                className={clsx(css.link, isActive("/") && css.active)}
                aria-current={isActive("/") ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className={clsx(css.link, isActive("/catalog") && css.active)}
                aria-current={isActive("/catalog") ? "page" : undefined}
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
