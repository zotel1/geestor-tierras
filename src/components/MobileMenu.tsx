"use client";

import Link from "next/link";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function MobileMenu({ open, setOpen }: Props) {
  return (
    <div
      className={`md:hidden fixed top-16 left-0 w-full bg-white shadow transition-all duration-300 z-40 ${
        open ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      <nav className="flex flex-col px-4 py-4 space-y-4 text-lg">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="hover:text-blue-600"
        >
          Inicio
        </Link>

        <Link
          href="/nuevo"
          onClick={() => setOpen(false)}
          className="hover:text-blue-600"
        >
          Nuevo pedido
        </Link>

        <Link
          href="/entregados"
          onClick={() => setOpen(false)}
          className="hover:text-blue-600"
        >
          Entregados
        </Link>
      </nav>
    </div>
  );
}
