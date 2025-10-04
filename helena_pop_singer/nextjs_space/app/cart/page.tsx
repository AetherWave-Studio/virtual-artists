
"use client";

import { useCartStore } from "@/lib/cart-store";
import { CartItem } from "@/components/cart-item";
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items,
          customerEmail: "",
          customerName: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err?.message || "Failed to start checkout");
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center py-20">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some amazing merchandise to get started!
            </p>
            <Link
              href="/merch"
              className="inline-flex items-center space-x-2 rounded-full bg-pink-500 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-pink-600 hover:shadow-xl"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Browse Merch</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-8 text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>

          <div className="space-y-4 mb-8">
            {items?.map((item) => (
              <motion.div
                key={item?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <CartItem item={item} />
              </motion.div>
            ))}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex justify-between text-lg">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="mb-4 flex justify-between text-lg">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total:</span>
                <span className="text-pink-500">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-medium text-white transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <button
              onClick={() => clearCart()}
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Cart
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/merch"
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
