"use client";

import Link from "next/link";

export default function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Fondo oscuro */}
      <button
        className="absolute inset-0 bg-black/30"
        onClick={() => setOpen(false)}
        aria-label="Cerrar menú"
      />

      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-72 bg-[#f5f1e8] border-l border-[#6d4c41]/25 shadow-xl p-4">
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-[#2f7d32]">🌿 Menú</div>
          <button
            className="px-3 py-1 rounded-xl border border-[#6d4c41]/25 bg-white/60"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <MenuLink href="/" setOpen={setOpen}>
            Inicio
          </MenuLink>
          <MenuLink href="/nuevo" setOpen={setOpen}>
            Nuevo pedido
          </MenuLink>
          <MenuLink href="/entregados" setOpen={setOpen}>
            Entregados
          </MenuLink>
        </div>

        <div className="mt-6 text-xs text-[#6d4c41]/70">
          Tip: marcá pedidos como “Entregados” para ver ingresos confirmados ✅
        </div>
      </div>
    </div>
  );
}

function MenuLink({
  href,
  children,
  setOpen,
}: {
  href: string;
  children: React.ReactNode;
  setOpen: (v: boolean) => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="px-3 py-3 rounded-xl font-semibold text-[#6d4c41] bg-white/60 border border-[#6d4c41]/15 hover:bg-[#c8e6c9] hover:text-[#2f7d32] transition"
    >
      {children}
    </Link>
  );
}
