"use client";

import { useState } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#f5f1e8] border-b border-[#6d4c41]/25 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* Logo */}
          <Link
            href="/"
            className="text-lg sm:text-xl font-extrabold text-[#2f7d32] tracking-tight"
            onClick={() => setOpen(false)}
          >
            🌱 Tierras Abonadas
          </Link>

          {/* Botón hamburguesa (mobile) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl border border-[#6d4c41]/25 bg-white/60 hover:bg-white transition"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-[#6d4c41]"></span>
              <span className="block w-6 h-0.5 bg-[#6d4c41]"></span>
              <span className="block w-6 h-0.5 bg-[#6d4c41]"></span>
            </div>
          </button>

          {/* Navbar escritorio */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/">Inicio</NavLink>
            <NavLink href="/nuevo">Nuevo pedido</NavLink>
            <NavLink href="/entregados">Entregados</NavLink>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-xl text-sm font-semibold text-[#6d4c41] hover:bg-[#c8e6c9] hover:text-[#2f7d32] transition"
    >
      {children}
    </Link>
  );
}