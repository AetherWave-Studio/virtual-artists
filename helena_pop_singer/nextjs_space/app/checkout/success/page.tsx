
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Package, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams?.get("session_id");
    
    if (!sessionId) {
      router.push("/");
      return;
    }

    fetchOrder(sessionId);
    clearCart();
  }, [searchParams]);

  const fetchOrder = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/orders/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data ?? null);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-500 p-6">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>

          <h1 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Thank you for your purchase! Your order has been successfully processed.
          </p>

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8 rounded-lg bg-white p-6 shadow-md text-left"
            >
              <h2 className="mb-4 text-xl font-semibold flex items-center">
                <Package className="mr-2 h-5 w-5 text-pink-500" />
                Order Details
              </h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-pink-500">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-semibold">Items:</h3>
                <div className="space-y-2">
                  {order.orderItems?.map((item: any) => (
                    <div key={item?.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item?.product?.name} x{item?.quantity}
                      </span>
                      <span>${(item?.price * item?.quantity)?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to <strong>sales@aetherwavestudio.com</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/merch"
                className="inline-flex items-center justify-center space-x-2 rounded-full bg-pink-500 px-8 py-3 text-white transition-all hover:bg-pink-600 hover:shadow-lg"
              >
                <span>Continue Shopping</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center space-x-2 rounded-full bg-gray-200 px-8 py-3 text-gray-700 transition-all hover:bg-gray-300"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
