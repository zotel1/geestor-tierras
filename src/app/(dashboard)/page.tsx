"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type { Pedido } from "@/lib/types";
import Link from "next/link";

export default function Home() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarPedidos = async () => {
    setCargando(true);
    const snap = await getDocs(collection(db, "pedidos"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Pedido[];

    // Orden: pendientes primero, dentro por fecha desc
    data.sort((a, b) => {
      if (a.estado === "pendiente" && b.estado === "entregado") return -1;
      if (a.estado === "entregado" && b.estado === "pendiente") return 1;
      return b.fecha.toMillis() - a.fecha.toMillis();
    });

    setPedidos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const toggleEstado = async (id: string, estadoActual: Pedido["estado"]) => {
    const nuevoEstado = estadoActual === "pendiente" ? "entregado" : "pendiente";
    await updateDoc(doc(db, "pedidos", id), { estado: nuevoEstado });
    await cargarPedidos();
  };

  const eliminarPedido = async (id: string) => {
    if (!confirm("¿Eliminar este pedido?")) return;
    await deleteDoc(doc(db, "pedidos", id));
    await cargarPedidos();
  };

  // Stats
  const totalPendiente = pedidos
    .filter((p) => p.estado === "pendiente")
    .reduce((acc, p) => acc + p.total, 0);

  const totalEntregado = pedidos
    .filter((p) => p.estado === "entregado")
    .reduce((acc, p) => acc + p.total, 0);

  const totalGeneral = totalPendiente + totalEntregado;

  return (
    <div className="mt-4 space-y-4">
      {/* Cards de stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Total pendiente</p>
          <p className="text-2xl font-semibold">
            ${totalPendiente.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Total entregado</p>
          <p className="text-2xl font-semibold">
            ${totalEntregado.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Total general</p>
          <p className="text-2xl font-semibold">
            ${totalGeneral.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Pedidos</h2>
          <Link
            href="/nuevo"
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Nuevo pedido
          </Link>
        </div>

        {cargando ? (
          <p>Cargando...</p>
        ) : pedidos.length === 0 ? (
          <p>No hay pedidos registrados.</p>
        ) : (
          <div className="space-y-3">
            {pedidos.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between border rounded p-3 gap-2"
              >
                <div>
                  <p className="font-semibold">
                    {p.clienteNombre || "Pedido"} · Calle {p.calle} {p.numero}
                  </p>
                  <p className="text-sm text-gray-600">
                    {p.fecha.toDate().toLocaleDateString()} ·{" "}
                    {p.cantidad} u. × ${p.precioUnitario} ={" "}
                    <span className="font-semibold">
                      ${p.total.toLocaleString("es-AR")}
                    </span>
                  </p>
                  <p className="text-xs mt-1">
                    Estado:{" "}
                    <span
                      className={
                        p.estado === "pendiente"
                          ? "text-yellow-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {p.estado}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleEstado(p.id, p.estado)}
                    className="px-2 py-1 text-xs rounded border"
                  >
                    Marcar como{" "}
                    {p.estado === "pendiente" ? "entregado" : "pendiente"}
                  </button>

                  <Link
                    href={`/pedido/${p.id}`}
                    className="px-2 py-1 text-xs rounded border"
                  >
                    Detalle
                  </Link>

                  <button
                    onClick={() => eliminarPedido(p.id)}
                    className="px-2 py-1 text-xs rounded border border-red-500 text-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
