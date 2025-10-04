
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Image as ImageIcon, Package, ShoppingCart, LogOut, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const session = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, galleryItems: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.status === "authenticated") {
      if (!(session?.data?.user as any)?.isAdmin) {
        router.push("/");
      } else {
        fetchStats();
      }
    }
  }, [session?.status, session?.data, router]);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, galleryRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/gallery"),
      ]);

      const products = await productsRes.json();
      const orders = await ordersRes.json();
      const gallery = await galleryRes.json();

      setStats({
        products: products?.length ?? 0,
        orders: orders?.length ?? 0,
        galleryItems: gallery?.length ?? 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (session?.status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (session?.status !== "authenticated" || !(session?.data?.user as any)?.isAdmin) {
    return null;
  }

  const adminCards = [
    {
      title: "Gallery Management",
      description: "Manage photos, videos, and articles",
      icon: ImageIcon,
      count: stats.galleryItems,
      href: "/admin/gallery",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Products",
      description: "View merchandise and inventory",
      icon: Package,
      count: stats.products,
      href: "/merch",
      color: "from-pink-500 to-red-500",
    },
    {
      title: "Orders",
      description: "View customer orders",
      icon: ShoppingCart,
      count: stats.orders,
      href: "/admin/orders",
      color: "from-blue-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {session?.data?.user?.name || session?.data?.user?.email}
            </p>
          </motion.div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link href={card.href}>
                  <div className="group h-full rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className={`mb-4 inline-flex rounded-full bg-gradient-to-r ${card.color} p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <div className="text-3xl font-bold text-pink-500">
                      {card.count}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
