
"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
  category: string;
}

export default function MerchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data ?? []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(products?.map((p) => p?.category) ?? []))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products?.filter((p) => p?.category === selectedCategory) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-4">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">
            Official Merchandise
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shop exclusive Helena merchandise and show your support
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {categories?.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category ?? "All")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No products found in this category</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts?.map((product, index) => (
              <motion.div
                key={product?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
