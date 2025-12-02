"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Pedido } from "@/lib/types";

export default function EntregadosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const snap = await getDocs(collection(db, "pedidos"));
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() })) as Pedido[]
        .filter((p) => p.estado === "entregado");

      // Orden por fecha desc
      data.sort((a, b) => b.fecha.toMillis() - a.fecha.toMillis());

      setPedidos(data);
      setCargando(false);
    };
    cargar();
  }, []);

  const totalEntregado = pedidos.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="mt-4 bg-white rounded shadow p-4">
      <h1 className="text-2xl font-semibold mb-2">Pedidos entregados</h1>
      <p className="mb-4 text-sm text-gray-600">
        Total ingresos por pedidos entregados:{" "}
        <span className="font-semibold">
          ${totalEntregado.toLocaleString("es-AR")}
        </span>
      </p>

      {cargando ? (
        <p>Cargando...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos entregados.</p>
      ) : (
        <div className="space-y-3">
          {pedidos.map((p) => (
            <div key={p.id} className="border rounded p-3">
              <p className="font-semibold">
                {p.clienteNombre || "Pedido"} · Calle {p.calle} {p.numero}
              </p>
              <p className="text-sm text-gray-600">
                {p.fecha.toDate().toLocaleDateString()} · {p.cantidad} u. × $
                {p.precioUnitario} ={" "}
                <span className="font-semibold">
                  ${p.total.toLocaleString("es-AR")}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
