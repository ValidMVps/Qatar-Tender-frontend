// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Logo / Brand */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-black">QatarTender</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Streamlining tender management across Qatar.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-black">Company</h2>
            <Link
              href="#"
              className="text-gray-600 hover:text-black transition"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-black transition"
            >
              Careers
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-black transition"
            >
              Blog
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-black">Support</h2>
            <Link
              href="#"
              className="text-gray-600 hover:text-black transition"
            >
              Help Center
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-black transition"
            >
              Contact Us
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-black transition"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2 text-gray-600 text-sm">
          <span>Email: info@qatartender.com</span>
          <span>Phone: +974 1234 5678</span>
          <span>Address: Doha, Qatar</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-gray-500 text-sm">
          <span>© 2025 QatarTender. All rights reserved.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="#" className="hover:text-black transition">
              Terms
            </Link>
            <Link href="#" className="hover:text-black transition">
              Privacy
            </Link>
            <Link href="#" className="hover:text-black transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
