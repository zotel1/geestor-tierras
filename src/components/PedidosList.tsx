"use client";

import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

type Pedido = {
    id: string;
    calle: string;
    numero: number;
    cantidad: number;
    precioUnitario: number;
    total: number;
    estado: "pendiente" | "entregado";
    fecha: any;
    clienteNombre: string | null;
};

export default function PedidosList() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "pedidos"), 
            orderBy("estado", "asc"),
            orderBy("fecha", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data: Pedido[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Pedido, "id">),
                }));
                setPedidos(data);
                setLoading(false);
            });

        return () => unsub();
    }, []);

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
        {pedidos.map((p) => (
            <div key={p.id} 
            className="bg-[#f5f1e8] border border-[#6d4c41]/30 rounded-xl p-4 shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-[#2f7d32]">
                        {p.clienteNombre ?? "Pedido"} - Calle {p.calle} N° {p.numero}</h3>
                    <p className="text-sm text-[#6d4c41]">
                        {p.cantidad} x ${p.precioUnitario} ={" "}
                        <span className="font-semibold">${p.total}</span>
                        </p>
                        <p className="text-xs">
                            Estado:{" "}
                            <span className={
                                p.estado === "pendiente"
                                ? "text-yellow-700"
                                : "text-green-700"
                            }>
                                {p.estado}
                            </span>
                        </p>
                </div>

                <div className="flex gap-2">
                    {p.estado === "pendiente" && (
                        <button
                            onClick={() => marcarEntregado(p.id)}
                            className="px-3 py-1 rounded-lg bg-green-600 text-while text-sm hover:bg-green-700"
                            >
                                Entregar
                            </button>
                    )}
                    <button
                        onClick={() => eliminarPedido(p.id)}
                        className="px-3 py-1 rounded-lg bg-red-600 text-while text-sm hover:bg-red-700"
                        >
                        Eliminar
                        </button>
                </div>
            </div>
        ))}
    </div>
);
}