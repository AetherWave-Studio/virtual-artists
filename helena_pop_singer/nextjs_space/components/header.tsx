
"use client";

import Link from "next/link";
import { ShoppingCart, Music, Image as ImageIcon, Home } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { usePathname } from "next/navigation";

export function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/merch", label: "Merch", icon: Music },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-pink-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              HELENA
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-pink-500 ${
                    isActive ? "text-pink-500" : "text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/cart"
            className="relative flex items-center space-x-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-pink-600 hover:shadow-lg"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        <nav className="md:hidden flex items-center justify-around border-t py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 text-xs transition-colors ${
                  isActive ? "text-pink-500" : "text-gray-600"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
