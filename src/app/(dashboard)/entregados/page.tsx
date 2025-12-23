"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

type PedidoEntregado = {
  id: string;
  calle: string;
  numero: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado: "entregado";
  fecha: any;
  clienteNombre?: string | null;
};

export default function EntregadosPage() {
  const [pedidos, setPedidos] = useState<PedidoEntregado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "pedidos"),
      where("estado", "==", "entregado"),
      orderBy("fecha", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<PedidoEntregado, "id">),
      }));
      setPedidos(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);


  const totalEntregado = useMemo(() => {
    return pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
  }, [pedidos]);

  return (
    <div className="space-y-6">
      <div className="bg-[#f5f1e8] border border-[#6d4c41]/30 rounded-2xl p-5 shadow-sm">
      <h1 className="text-3xl font-bold text-[#2f7d32]">
        📦 Pedidos Entregados
      </h1>
      <p className="mt-1 text-[#6d4c41]">
          Acá ves los pedidos ya entregados y el total confirmado.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-[#c8e6c9] text-[#2f7d32] px-4 py-2 rounded-xl font-semibold">
          Total entregado:
          <span>${totalEntregado.toLocaleString("es-AR")}</span>
        </div>
      </div>
      {loading ? (
        <p className="text-center text-green-700">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <div className="bg-white rounded-xl p-4 border border-[#6d4c41]/20">
          <p className="text-[#6d4c41]">
            Todavia no hay pedidos entregados.🚜
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p) => (
            <div 
            key={p.id} 
            className="bg-white border border-[#6d4c41]/20 rounded-xl p-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[#2f7d32]">
                    {p.clienteNombre ?? "Pedido"} – Calle {p.calle} #{p.numero}
                  </h3>

                  <p className="text-sm text-[#6d4c41]">
                    {p.cantidad} × ${p.precioUnitario} ={" "}
                    <span className="font-semibold">
                      ${p.total.toLocaleString("es-AR")}
                    </span>
                  </p>

                  <p className="text-xs text-[#6d4c41]/80 mt-1">
                    Fecha:{" "}
                    {p.fecha?.toDate
                      ? p.fecha.toDate().toLocaleString("es-AR")
                      : "-"}
                  </p>
                </div>

                <span className="inline-flex self-start md:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-[#c8e6c9] text-[#2f7d32]">
                  Entregado
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}