import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestor de Tierras Abonadas",
  description: "Dashboard de pedidos y gestión de tierras abonadas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">{children}
      </body>
    </html>
  );
}