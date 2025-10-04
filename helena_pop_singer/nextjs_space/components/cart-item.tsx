
"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, CartItem as CartItemType } from "@/lib/cart-store";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.inventory) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  return (
    <div className="flex items-center space-x-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">
          ${item.price.toFixed(2)} each
        </p>
        <p className="text-xs text-gray-400">
          {item.inventory} available
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleDecrease}
          className="rounded-md bg-gray-100 p-1 transition-colors hover:bg-gray-200"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          disabled={item.quantity >= item.inventory}
          className="rounded-md bg-gray-100 p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <span className="text-lg font-bold text-pink-500">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-500 transition-colors hover:text-red-600"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
