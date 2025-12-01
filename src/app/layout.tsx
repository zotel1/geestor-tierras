import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Gestor de Tierras Abonadas",
  description: "CRUD en Next + Firebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className="bg-gray-100 min-h-screen">
        <Navbar />
        <main className="pt-16 px-4 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
