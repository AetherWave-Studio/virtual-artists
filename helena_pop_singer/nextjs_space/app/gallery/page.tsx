
"use client";

import { useEffect, useState } from "react";
import { GalleryCard } from "@/components/gallery-card";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  type: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch("/api/gallery");
      const data = await response.json();
      setItems(data ?? []);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-4">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">
            Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore exclusive photos, behind-the-scenes moments, and personal stories from Helena
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        ) : items?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No gallery items found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items?.map((item, index) => (
              <motion.div
                key={item?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <GalleryCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
