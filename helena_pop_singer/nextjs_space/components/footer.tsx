
import { Music, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-pink-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              HELENA
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <a href="mailto:sales@aetherwavestudio.com" className="hover:text-pink-500 transition-colors">
              sales@aetherwavestudio.com
            </a>
          </div>

          <div className="flex space-x-4 text-sm">
            <Link href="/admin" className="text-gray-600 hover:text-pink-500 transition-colors">
              Admin
            </Link>
          </div>

          <p className="text-xs text-gray-500 text-center">
            © 2025 Helena. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
