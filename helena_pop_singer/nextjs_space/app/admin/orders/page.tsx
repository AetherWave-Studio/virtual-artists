
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Order {
  id: string;
  customerEmail: string;
  customerName: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
    };
  }>;
}

export default function AdminOrdersPage() {
  const session = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.status === "authenticated") {
      if (!(session?.data?.user as any)?.isAdmin) {
        router.push("/");
      } else {
        fetchOrders();
      }
    }
  }, [session?.status, session?.data, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data ?? []);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/admin"
            className="text-gray-600 hover:text-pink-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>

        {orders?.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div
                key={order?.id}
                className="rounded-lg bg-white border p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Order #{order?.id?.slice(0, 8)}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {order?.customerName || "Guest"}
                    </p>
                    <p className="text-sm text-gray-600">{order?.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-500">
                      ${order?.totalAmount?.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <div className="space-y-2">
                    {order?.orderItems?.map((item) => (
                      <div
                        key={item?.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item?.product?.name} x{item?.quantity}
                        </span>
                        <span>${(item?.price * item?.quantity)?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
