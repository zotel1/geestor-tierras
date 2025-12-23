"use client";

import {useMemo } from "react";
import { usePedidos } from "./PedidosProvider";
import { count } from "console";

export default function DashboardStats() {
    const { pedidos, loading } = usePedidos();

    const stats = useMemo(() => {
        const pendientes = pedidos.filter((p) => p.estado === "pendiente");
        const entregados = pedidos.filter((p) => p.estado === "entregado");

        const totalPendiente = pendientes.reduce((acc, p) => acc + (p.total || 0), 0);
        const totalEntregado = entregados.reduce((acc, p) => acc + (p.total || 0), 0);

        return {
            countPendientes: pendientes.length,
            countEntregados: entregados.length,
            totalPendiente,
            totalEntregado,
            totalGeneral: totalPendiente + totalEntregado,
        };
    }, [pedidos]);

    const money = (n: number) => n.toLocaleString("es-AR");

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
                title="Pendientes"
                value={`${stats.countPendientes}`}
                subtitle={`$${money(stats.totalPendiente)} por entregar`}
                badge="⏳"
                loading={loading}
            />
            <Card 
                title="Entregados"
                value={`${stats.countEntregados}`}
                subtitle={`$${money(stats.totalEntregado)} confirmados`}
                badge="✅"
                loading={loading}
            />
            <Card
                title="Total"
                value={`$${money(stats.totalGeneral)}`}
                subtitle="Pendiente + Entregado"
                badge="🌿"
                loading={loading}
            />
        </div>
    );
}

function Card({
    title,
    value,
    subtitle,
    badge,
    loading,
}: {
    title: string;
    value: string;
    subtitle: string;
    badge: string;
    loading: boolean;
}) {
    return (
        <div className="bg-[#f5f1e8] border border-[#6d4c41]/25 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#6d4c41]">{title}</h3>
        <span className="text-xl">{badge}</span>
      </div>

      <div className="mt-2 text-2xl font-extrabold text-[#2f7d32]">
        {loading ? "…" : value}
      </div>

      <div className="mt-1 text-sm text-[#6d4c41]/80">{subtitle}</div>
    </div>
  );
}