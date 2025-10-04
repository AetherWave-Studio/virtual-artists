
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Loader2, ArrowLeft, Image as ImageIcon, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  type: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const session = useSession();
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "image",
    published: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.status === "authenticated") {
      if (!(session?.data?.user as any)?.isAdmin) {
        router.push("/");
      } else {
        fetchItems();
      }
    }
  }, [session?.status, session?.data, router]);

  const fetchItems = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("published", String(formData.published));
      if (file) {
        formDataToSend.append("file", file);
      }

      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: "", description: "", content: "", type: "image", published: true });
        setFile(null);
        fetchItems();
      }
    } catch (error) {
      console.error("Error creating gallery item:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-xl font-semibold">Create Gallery Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="image">Image</option>
                  <option value="article">Article</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {formData.type === "article" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}

              {formData.type === "image" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Published
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 rounded-lg bg-pink-500 px-6 py-2 text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((item) => (
            <div key={item?.id} className="rounded-lg bg-white border p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {item?.type === "image" ? (
                    <ImageIcon className="h-5 w-5 text-pink-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-purple-500" />
                  )}
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {item?.type}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item?.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
                {item?.title}
              </h3>
              {item?.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {item?.description}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(item?.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
