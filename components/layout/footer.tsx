"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import logo from "@/public/logo.png";
import logoDark from "@/public/logo-dark.png";

export function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {theme === "dark" ? (
              <Image
                src={logoDark.src}
                alt="logo"
                width={60}
                height={40}
                className="h-full w-auto"
              />
            ) : (
              <Image
                src={logo.src}
                alt="logo"
                width={60}
                height={40}
                className="h-full w-auto"
              />
            )}
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Haus Real Estate. Все права защищены.
          </p>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/catalog"
              className="hover:text-foreground transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/register"
              className="hover:text-foreground transition-colors"
            >
              Разместить объект
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
