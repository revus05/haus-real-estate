"use client";

import {
  LayoutDashboard,
  ListPlus,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import logo from "public/logo.png";
import logoDark from "public/logo-dark.png";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useSession } from "@/hooks/use-session";
import { clearUser } from "@/store/sessionSlice";

export function Header() {
  const user = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearUser());
    router.push("/");
    router.refresh();
    toast.success("Выход выполнен успешно");
  }

  const navLinks = [
    { href: "/catalog", label: "Каталог" },
    ...(user
      ? [{ href: "/listings/new", label: "Разместить объявление" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Личный кабинет
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/listings">
                    <ListPlus className="mr-2 h-4 w-4" />
                    Мои объявления
                  </Link>
                </DropdownMenuItem>
                {(user.role === "REALTOR" || user.role === "ADMIN") && (
                  <DropdownMenuItem asChild>
                    <Link href="/leads">
                      <User className="mr-2 h-4 w-4" />
                      Заявки
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <User className="mr-2 h-4 w-4" />
                      Администрирование
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {theme === "dark" ? "Светлая тема" : "Темная тема"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Выход
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Войти</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Начать</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 flex flex-col p-0">
              <SheetTitle className="sr-only">Меню навигации</SheetTitle>

              {/* User profile section */}
              {user && (
                <div className="border-b px-6 py-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg font-semibold">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              <nav className="flex flex-col gap-2 flex-1 px-6 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-medium px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <>
                    <Link
                      href="/login"
                      className="text-base font-medium px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      Войти
                    </Link>
                    <Link
                      href="/register"
                      className="text-base font-medium px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      Начать
                    </Link>
                  </>
                )}
              </nav>

              {/* Logout button at the bottom */}
              {user && (
                <div className="border-t px-6 py-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start text-base font-medium text-destructive px-3 py-2 rounded-md hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Выход
                  </button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
