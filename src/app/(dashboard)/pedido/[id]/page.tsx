"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import type { Pedido, EstadoPedido } from "@/lib/types";

export default function PedidoDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [cantidad, setCantidad] = useState<number | "">("");
  const [precioUnitario, setPrecioUnitario] = useState<number | "">("");
  const [fecha, setFecha] = useState<string>("");
  const [estado, setEstado] = useState<EstadoPedido>("pendiente");
  const [calle, setCalle] = useState<string>("");
  const [numero, setNumero] = useState<number | "">("");
  const [clienteNombre, setClienteNombre] = useState<string>("");

  useEffect(() => {
    const cargar = async () => {
      const ref = doc(db, "pedidos", params.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setMensaje("Pedido no encontrado");
        setCargando(false);
        return;
      }
      const data = { id: snap.id, ...snap.data() } as Pedido;
      setPedido(data);

      setCantidad(data.cantidad);
      setPrecioUnitario(data.precioUnitario);
      setFecha(data.fecha.toDate().toISOString().split("T")[0]);
      setEstado(data.estado);
      setCalle(data.calle);
      setNumero(data.numero);
      setClienteNombre(data.clienteNombre || "");
      setCargando(false);
    };
    cargar();
  }, [params.id]);

  const total =
    typeof cantidad === "number" &&
    typeof precioUnitario === "number" &&
    !Number.isNaN(cantidad) &&
    !Number.isNaN(precioUnitario)
      ? cantidad * precioUnitario
      : 0;

  const guardarCambios = async (e: FormEvent) => {
    e.preventDefault();
    if (!pedido) return;

    const ref = doc(db, "pedidos", pedido.id);
    await updateDoc(ref, {
      cantidad: Number(cantidad),
      precioUnitario: Number(precioUnitario),
      total,
      fecha: Timestamp.fromDate(new Date(fecha)),
      estado,
      calle,
      numero: Number(numero),
      clienteNombre: clienteNombre || null,
    });

    setMensaje("Cambios guardados ✔");
  };

  const cambiarEstado = async () => {
    if (!pedido) return;
    const nuevoEstado: EstadoPedido =
      estado === "pendiente" ? "entregado" : "pendiente";
    await updateDoc(doc(db, "pedidos", pedido.id), {
      estado: nuevoEstado,
    });
    setEstado(nuevoEstado);
    setMensaje("Estado actualizado ✔");
  };

  const eliminar = async () => {
    if (!pedido) return;
    if (!confirm("¿Eliminar este pedido?")) return;
    await deleteDoc(doc(db, "pedidos", pedido.id));
    router.push("/");
  };

  if (cargando) return <p className="mt-4">Cargando...</p>;
  if (!pedido) return <p className="mt-4">{mensaje || "Error"}</p>;

  return (
    <div className="mt-4 bg-white rounded shadow p-4">
      <h1 className="text-2xl font-semibold mb-4">Detalle del pedido</h1>

      <form onSubmit={guardarCambios} className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          value={clienteNombre}
          onChange={(e) => setClienteNombre(e.target.value)}
          placeholder="Nombre cliente (opcional)"
          className="border p-2 rounded"
        />

        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          placeholder="Cantidad"
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(Number(e.target.value))}
          placeholder="Precio unitario"
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <select
          value={estado}
          onChange={(e) =>
            setEstado(e.target.value as EstadoPedido)
          }
          className="border p-2 rounded"
        >
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado</option>
        </select>

        <input
          type="text"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
          placeholder="Calle"
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          value={numero}
          onChange={(e) => setNumero(Number(e.target.value))}
          placeholder="Número"
          className="border p-2 rounded"
          required
        />

        <div className="md:col-span-2 flex items-center justify-between mt-2">
          <p className="font-semibold">
            Total:{" "}
            <span className="text-blue-600">
              ${Number.isNaN(total) ? 0 : total}
            </span>
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Guardar cambios
          </button>
        </div>
      </form>

      <div className="mt-4 flex gap-2">
        <button
          onClick={cambiarEstado}
          className="px-3 py-2 rounded border text-sm"
        >
          Marcar como {estado === "pendiente" ? "entregado" : "pendiente"}
        </button>

        <button
          onClick={eliminar}
          className="px-3 py-2 rounded border border-red-500 text-red-500 text-sm"
        >
          Eliminar pedido
        </button>
      </div>

      {mensaje && <p className="mt-3 text-green-600">{mensaje}</p>}
    </div>
  );
}
