
"use client";

import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    inventory: number;
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (product.inventory <= 0) return;

    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      inventory: product.inventory,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  const isOutOfStock = product.inventory <= 0;

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="mt-1 text-xs text-gray-500">{product.category}</p>
          </div>
          <span className="text-lg font-bold text-pink-500">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Package className="h-3 w-3" />
            <span>{product.inventory} in stock</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-400"
                : isAdding
                ? "bg-green-500"
                : "bg-pink-500 hover:bg-pink-600 hover:shadow-lg"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isAdding ? "Added!" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
