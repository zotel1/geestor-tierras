"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Pedido = {
  id: string;
  calle: string;
  numero: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado: "pendiente" | "entregado";
  fecha: any; // Timestamp Firestore
  clienteNombre?: string | null;
};

type PedidosContextValue = {
  pedidos: Pedido[];
  loading: boolean;
};

const PedidosContext = createContext<PedidosContextValue | null>(null);

export function PedidosProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "pedidos"),
      orderBy("estado", "asc"),
      orderBy("fecha", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Pedido[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Pedido, "id">),
      }));
      setPedidos(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const value = useMemo(() => ({ pedidos, loading }), [pedidos, loading]);

  return <PedidosContext.Provider value={value}>{children}</PedidosContext.Provider>;
}

export function usePedidos() {
  const ctx = useContext(PedidosContext);
  if (!ctx) throw new Error("usePedidos debe usarse dentro de <PedidosProvider />");
  return ctx;
}
