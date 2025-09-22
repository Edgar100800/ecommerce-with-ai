import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerce Images - Prueba Virtual con IA",
  description:
    "Prueba ropa virtualmente con nuestra tecnología de inteligencia artificial avanzada. Ve cómo te queda cualquier prenda antes de comprar.",
  keywords: [
    "ecommerce",
    "prueba virtual",
    "inteligencia artificial",
    "moda",
    "ropa",
  ],
  authors: [{ name: "Ecommerce Images" }],
  openGraph: {
    title: "Ecommerce Images - Prueba Virtual con IA",
    description:
      "Prueba ropa virtualmente con nuestra tecnología de inteligencia artificial avanzada.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Ecommerce Images
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Prueba virtual con IA
                  </p>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Inicio
                </Link>
                <Link
                  href="#productos"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Productos
                </Link>
                <Link
                  href="#como-funciona"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ¿Cómo funciona?
                </Link>
                {process.env.NODE_ENV === "development" && (
                  <Link
                    href="/diagnostic"
                    className="text-orange-600 hover:text-orange-800 transition-colors font-medium flex items-center gap-1"
                    title="Diagnóstico de Google AI"
                  >
                    <span>🔧</span>
                    Diagnóstico
                  </Link>
                )}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Search Button */}
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Cart Button */}
                <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5M7 13v6a1 1 0 001 1h9a1 1 0 001-1v-6M9 21v-8a1 1 0 011-1h4a1 1 0 011 1v8"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </button>

                {/* Mobile menu button */}
                <button className="md:hidden text-gray-400 hover:text-gray-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-2 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ecommerce Images</h3>
                    <p className="text-sm text-gray-400">
                      Prueba virtual con IA
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  Revolucionamos la experiencia de compra online con tecnología
                  de inteligencia artificial avanzada. Prueba cualquier prenda
                  virtualmente antes de comprar.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">100% Gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">IA Avanzada</span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Productos</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      Camisetas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      Pantalones
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      Vestidos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      Chaquetas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      Accesorios
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Soporte</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Centro de Ayuda
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Cómo funciona
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Devoluciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Contacto
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-800 mt-8 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <p className="text-gray-400 text-sm">
                    © 2024 Ecommerce Images. Todos los derechos reservados.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Privacidad
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Términos
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Cookies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
