"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import Icon from "@/components/Icon";

const navLinks = [
  { href: "/shop", label: "Colecții" },
  { href: "/about", label: "Despre Noi" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f9f9f9]/80 backdrop-blur-md flex justify-between items-center px-12 h-20 transition-all duration-500 border-b border-black/5">
      <div className="flex-1 flex items-center">
        <nav className="hidden md:flex gap-8 items-center h-full">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/")) ||
              (link.href === "/shop" && pathname.startsWith("/shop/"));
            return (
              <Link
                key={link.href}
                className={`pb-1 font-label text-[11px] uppercase tracking-widest transition-colors duration-300 ${
                  isActive
                    ? "text-[#1a1c1c] border-b border-[#974730]"
                    : "text-[#1a1c1c]/60 hover:text-[#974730]"
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <Link
        href="/"
        className="text-2xl font-serif tracking-tighter text-[#1a1c1c] font-black cursor-pointer hover:opacity-80 transition-opacity"
      >
        RED STUDIO
      </Link>
      <div className="flex-1 flex justify-end items-center gap-6">
        <Link
          href={isLoggedIn ? "/account" : "/login"}
          className="flex items-center gap-2"
        >
          {isLoggedIn ? (
            <Icon
              name="person"
              className="h-6 w-6 cursor-pointer text-[#1a1c1c] transition-all duration-300 hover:scale-110 hover:text-[#974730]"
            />
          ) : (
            <Icon
              name="login"
              className="h-6 w-6 cursor-pointer text-[#1a1c1c] transition-all duration-300 hover:scale-110 hover:text-[#974730]"
            />
          )}
        </Link>
        <Link href="/cart" className="relative">
          <Icon
            name="shopping-bag"
            className="h-6 w-6 cursor-pointer text-[#1a1c1c] transition-all duration-300 hover:scale-110 hover:text-[#974730]"
          />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-[10px] font-label flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
