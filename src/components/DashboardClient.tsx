"use client";

import DashboardStats from "@/components/pedidos/DashboardStats";
import { PedidosProvider } from "@/components/pedidos/PedidosProvider";
import PedidosList from "@/components/PedidosList";
import Link from "next/link";

export default function DashboardClient() {
  return (
    <PedidosProvider>
      <div className="space-y-6">
        <div className="bg-[#f5f1e8] border border-[#6d4c41]/25 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold text-[#2f7d32]">
                🌱 Dashboard
              </h1>
              <p className="text-[#6d4c41]/80 mt-1">
                Gestión de pedidos de tierra abonada.
              </p>
            </div>

            <Link
              href="/nuevo"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#2f7d32] text-white font-semibold hover:bg-[#256628] transition"
            >
              + Nuevo pedido
            </Link>
          </div>
        </div>

        <DashboardStats />
        <PedidosList />
      </div>
    </PedidosProvider>
  );
}
