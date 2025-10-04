
"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-500 p-6">
              <XCircle className="h-16 w-16 text-white" />
            </div>
          </div>

          <h1 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
            Checkout Cancelled
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Your order was not completed. Your cart items are still saved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center space-x-2 rounded-full bg-pink-500 px-8 py-3 text-white transition-all hover:bg-pink-600 hover:shadow-lg"
            >
              <span>Return to Cart</span>
            </Link>
            <Link
              href="/merch"
              className="inline-flex items-center justify-center space-x-2 rounded-full bg-gray-200 px-8 py-3 text-gray-700 transition-all hover:bg-gray-300"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
