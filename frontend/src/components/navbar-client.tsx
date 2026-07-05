"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { logout } from "@/lib/auth";
import { navLinks } from "@/lib/links";
import { Button } from "@/components/ui/button";
import { DropdownCustom } from "@/components/ui/dropdown-custom";

interface NavbarClientProps {
  user: { username: string; email: string } | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();

  async function handleLogout() {
    sessionStorage.clear();
    await logout();
    router.push("/");
    router.refresh();
  }

  const mobileItems = [
    ...navLinks.map((link) => ({
      label: link.label,
      href: link.href,
    })),
    ...(user
      ? [
          {
            label: `Profile`,
            href: "/profile",
          },
          {
            label: "Log out",
            onClick: handleLogout,
            variant: "destructive" as const,
          },
        ]
      : [
          { label: "Log in", href: "/login" },
          { label: "Sign up", href: "/register" },
        ]),
  ];

  return (
    <nav className="flex items-center justify-between border-b px-6 py-3">
      {/* Left group — logo + nav links together */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="font-semibold">
          Iris Brewery
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile logo — only visible on mobile */}
      <Link href="/" className="font-semibold md:hidden">
        Iris Brewery
      </Link>

      {/* Desktop auth — right side */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
              {user.username}
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <div className="flex md:hidden">
        <DropdownCustom
          trigger={
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          }
          items={mobileItems}
          align="right"
        />
      </div>
    </nav>
  );
}