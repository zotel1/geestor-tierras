"use client";

import Link from "next/link";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMemo, useState } from "react";
import { usePedidos } from "./pedidos/PedidosProvider";

export default function PedidosList() {
    const { pedidos, loading } = usePedidos();
    const [q, setQ] = useState("");

    const filtrados = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return pedidos;

        return pedidos.filter((p) => {
            const cliente = (p.clienteNombre ?? "").toLowerCase();
            const calle = (p.calle ?? "").toLowerCase();
            const nro = String(p.numero ?? "");
            return (
                cliente.includes(term) ||
                calle.includes(term) ||
                nro.includes(term) || 
                `${calle} ${nro}`.includes(term)
            );
        });
    }, [pedidos, q]);

    const marcarEntregado = async (id: string) => {
        await updateDoc(doc(db, "pedidos", id), { 
            estado: "entregado",
        });
};

const eliminarPedido = async (id: string) => {
    if (!confirm("¿Eliminar pedido?")) return;
    await deleteDoc(doc(db, "pedidos", id));
};

if (loading) {
    return <p className="text-center text-green-700">Cargando pedidos...</p>;
}

return (
    <div className="space-y-4">
        {/* buscador */}
        <div className="bg-white border border-[#6d4c41]/15 rounded-2xl p-4 shadow-sm">
        <label className="text-sm font-semibold text-[#6d4c41]">Buscar</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: calle A, 10, Juan…"
          className="mt-2 w-full px-4 py-2 rounded-xl border border-[#6d4c41]/25 focus:outline-none focus:ring-2 focus:ring-[#c8e6c9]"
        />
      </div>

      {/* lista */}
      {filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-4 border border-[#6d4c41]/15">
          <p className="text-[#6d4c41]">No hay pedidos para mostrar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#6d4c41]/15 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-[#2f7d32]">
                      {p.clienteNombre ?? "Pedido"} – Calle {p.calle} #{p.numero}
                    </h3>
                    <span
                      className={
                        p.estado === "pendiente"
                          ? "text-xs font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800"
                          : "text-xs font-bold px-2 py-1 rounded-full bg-[#c8e6c9] text-[#2f7d32]"
                      }
                    >
                      {p.estado}
                    </span>
                  </div>

                  <p className="text-sm text-[#6d4c41] mt-1">
                    {p.cantidad} × ${p.precioUnitario} ={" "}
                    <span className="font-semibold">${p.total}</span>
                  </p>

                  <p className="text-xs text-[#6d4c41]/70 mt-1">
                    Fecha:{" "}
                    {p.fecha?.toDate ? p.fecha.toDate().toLocaleString("es-AR") : "-"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/pedido/${p.id}`}
                    className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#f5f1e8] border border-[#6d4c41]/20 text-[#6d4c41] hover:bg-[#c8e6c9] hover:text-[#2f7d32] transition"
                  >
                    Detalle
                  </Link>

                  {p.estado === "pendiente" && (
                    <button
                      onClick={() => marcarEntregado(p.id)}
                      className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#2f7d32] text-white hover:bg-[#256628] transition"
                    >
                      Entregar
                    </button>
                  )}

                  <button
                    onClick={() => eliminarPedido(p.id)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#c62828] text-white hover:bg-[#a61f1f] transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}