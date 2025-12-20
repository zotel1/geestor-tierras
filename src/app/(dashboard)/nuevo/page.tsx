"use client";

import { useState, type FormEvent } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function NuevoPedido() {
    const [cantidad, setCantidad] = useState<number | "">("");
    const [precioUnitario, setPrecioUnitario] = useState<number | "">("");
  const [fecha, setFecha] = useState<string>("");
  const [estado] = useState<"pendiente" | "entregado">("pendiente");
  const [calle, setCalle] = useState<string>("");
  const [numero, setNumero] = useState<number | "">("");
  const [clienteNombre, setClienteNombre] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");

  const total =
    typeof cantidad === "number" &&
    typeof precioUnitario === "number" &&
    !Number.isNaN(cantidad) &&
    !Number.isNaN(precioUnitario)
      ? cantidad * precioUnitario
      : 0;

  const enviar = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "pedidos"), {
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario),
        total,
        fecha: Timestamp.fromDate(new Date(fecha)),
        estado,
        calle,
        numero: Number(numero),
        clienteNombre: clienteNombre || null,
      });

      setMensaje("Pedido agregado con éxito ✔");
      setCantidad("");
      setPrecioUnitario("");
      setFecha("");
      setCalle("");
      setNumero("");
      setClienteNombre("");
    } catch (error) {
      console.error(error);
      setMensaje("Error al guardar ❌");
    }
  };

  return (
    <div className="mt-4 bg-white rounded shadow p-4">
      <h1 className="text-2xl font-semibold mb-4">Nuevo pedido</h1>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={enviar}>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          placeholder="Cantidad de unidades"
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

        <div className="flex gap-2">
          <select
            disabled
            value={estado}
            className="border p-2 rounded flex-1 bg-gray-100"
          >
            <option value="pendiente">Pendiente</option>
          </select>
          <input
            type="text"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
            placeholder="Nombre cliente (opcional)"
            className="border p-2 rounded flex-1"
          />
        </div>

        <input
          type="text"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
          placeholder="Calle (A–Z)"
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          value={numero}
          onChange={(e) => setNumero(Number(e.target.value))}
          placeholder="Número (1–100)"
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
            Guardar
          </button>
        </div>
      </form>

      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
    </div>
  );
}