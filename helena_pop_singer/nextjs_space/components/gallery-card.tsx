
"use client";

import Image from "next/image";
import { Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface GalleryCardProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    type: string;
    createdAt: string;
  };
}

export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <Link href={`/gallery/${item.id}`}>
      <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl">
        {item.type === "image" && item.imageUrl ? (
          <div className="relative aspect-[4/5] bg-gray-100">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
            <FileText className="h-16 w-16 text-pink-500" />
          </div>
        )}

        <div className="p-4">
          <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          {item.description && (
            <p className="mb-3 text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
