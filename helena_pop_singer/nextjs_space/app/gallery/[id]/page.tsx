
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  content: string | null;
  type: string;
  createdAt: string;
}

export default function GalleryItemPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchGalleryItem(params.id as string);
    }
  }, [params?.id]);

  const fetchGalleryItem = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`);
      const data = await response.json();
      setItem(data ?? null);
    } catch (error) {
      console.error("Error fetching gallery item:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Gallery item not found</p>
          <button
            onClick={() => router.push("/gallery")}
            className="text-pink-500 hover:text-pink-600"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/gallery")}
          className="mb-8 flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Gallery</span>
        </motion.button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
            {item.title}
          </h1>

          <div className="mb-6 flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {item.description && (
            <p className="mb-8 text-lg text-gray-600">{item.description}</p>
          )}

          {item.type === "image" && item.imageUrl && (
            <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-lg">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {item.content && (
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {item.content}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </div>
  );
}
