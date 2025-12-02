import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: "Gestor de Tierras Abonadas",
  description: "Dashboard de pedidos y gestión de tierras abonadas",
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
  <ProtectedRoute>
    <Navbar />
    <main className="pt-16 px-4 max-w-6xl mx-auto">{children}</main>
    </ProtectedRoute>
    );
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">
        {/* @ts-expect-error Server/Client bridge */}
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}