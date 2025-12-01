"use client";

import { useState } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full bg-white shadow z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="text-xl font-semibold">
            Tierras Abonadas
          </Link>

          {/* Botón hamburguesa */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            {/* Ícono hamburguesa */}
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
            </div>
          </button>

          {/* Navbar normal (escritorio) */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <Link href="/nuevo" className="hover:text-blue-600">Nuevo pedido</Link>
            <Link href="/entregados" className="hover:text-blue-600">Entregados</Link>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
}