"use client";

import { db } from "@/lib/firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PedidoForm = {
  calle: string;
  numero: number;
  cantidad: number;
  precioUnitario: number;
  estado: "pendiente" | "entregado";
  clienteNombre: string; // en UI lo manejamos como string
  fechaStr: string; // yyyy-mm-dd
};

export default function PedidoDetailClient({ id }: { id: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<PedidoForm>({
    calle: "",
    numero: 1,
    cantidad: 1,
    precioUnitario: 0,
    estado: "pendiente",
    clienteNombre: "",
    fechaStr: "",
  });

  const total = useMemo(() => {
    const c = Number(form.cantidad) || 0;
    const p = Number(form.precioUnitario) || 0;
    return c * p;
  }, [form.cantidad, form.precioUnitario]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const ref = doc(db, "pedidos", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("El pedido no existe.");
          setLoading(false);
          return;
        }

        const data = snap.data() as any;

        const fecha = data.fecha?.toDate ? data.fecha.toDate() : null;
        const yyyy = fecha ? fecha.getFullYear() : null;
        const mm = fecha ? String(fecha.getMonth() + 1).padStart(2, "0") : null;
        const dd = fecha ? String(fecha.getDate()).padStart(2, "0") : null;

        setForm({
          calle: String(data.calle ?? ""),
          numero: Number(data.numero ?? 1),
          cantidad: Number(data.cantidad ?? 1),
          precioUnitario: Number(data.precioUnitario ?? 0),
          estado: (data.estado === "entregado" ? "entregado" : "pendiente"),
          clienteNombre: data.clienteNombre ? String(data.clienteNombre) : "",
          fechaStr: fecha && yyyy && mm && dd ? `${yyyy}-${mm}-${dd}` : "",
        });

        setLoading(false);
      } catch (e: any) {
        setError(e?.message ?? "Error al cargar el pedido.");
        setLoading(false);
      }
    };

    run();
  }, [id]);

  const onChange = (key: keyof PedidoForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const guardar = async () => {
    try {
      setSaving(true);
      setError(null);

      // Convertimos yyyy-mm-dd a Date
      const fecha = form.fechaStr ? new Date(`${form.fechaStr}T12:00:00`) : null;

      await updateDoc(doc(db, "pedidos", id), {
        calle: form.calle,
        numero: Number(form.numero),
        cantidad: Number(form.cantidad),
        precioUnitario: Number(form.precioUnitario),
        total,
        estado: form.estado,
        clienteNombre: form.clienteNombre.trim() ? form.clienteNombre.trim() : null,
        ...(fecha ? { fecha } : {}), // si no hay fecha, no la tocamos
      });

      setSaving(false);
      router.refresh();
      alert("Pedido actualizado ✅");
    } catch (e: any) {
      setSaving(false);
      setError(e?.message ?? "Error al guardar.");
    }
  };

  const toggleEstado = async () => {
    try {
      setSaving(true);
      setError(null);

      const nuevoEstado = form.estado === "pendiente" ? "entregado" : "pendiente";

      await updateDoc(doc(db, "pedidos", id), {
        estado: nuevoEstado,
      });

      setForm((prev) => ({ ...prev, estado: nuevoEstado }));
      setSaving(false);
    } catch (e: any) {
      setSaving(false);
      setError(e?.message ?? "Error al cambiar estado.");
    }
  };

  const eliminar = async () => {
    if (!confirm("¿Eliminar este pedido?")) return;

    try {
      setSaving(true);
      setError(null);
      await deleteDoc(doc(db, "pedidos", id));
      setSaving(false);
      router.push("/");
    } catch (e: any) {
      setSaving(false);
      setError(e?.message ?? "Error al eliminar.");
    }
  };

  if (loading) {
    return <p className="text-center text-green-700">Cargando pedido...</p>;
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-4">
        <p className="text-red-700 font-semibold">Error:</p>
        <p className="text-red-700">{error}</p>
        <Link href="/" className="inline-block mt-3 text-[#2f7d32] font-semibold">
          ← Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#f5f1e8] border border-[#6d4c41]/25 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2f7d32]">🧾 Detalle</h1>
            <p className="text-[#6d4c41]/80 mt-1">
              Editá los datos del pedido y guardá cambios.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-white/60 border border-[#6d4c41]/20 text-[#6d4c41] font-semibold hover:bg-[#c8e6c9] hover:text-[#2f7d32] transition"
            >
              ← Volver
            </Link>

            <button
              onClick={toggleEstado}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#2f7d32] text-white font-semibold hover:bg-[#256628] disabled:opacity-60 transition"
            >
              {form.estado === "pendiente" ? "Marcar entregado" : "Marcar pendiente"}
            </button>

            <button
              onClick={eliminar}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#c62828] text-white font-semibold hover:bg-[#a61f1f] disabled:opacity-60 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-[#6d4c41]/15 rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre (opcional)">
            <input
              value={form.clienteNombre}
              onChange={(e) => onChange("clienteNombre", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#6d4c41]/25 focus:outline-none focus:ring-2 focus:ring-[#c8e6c9]"
              placeholder="Ej: Juan"
            />
          </Field>

          <Field label="Fecha del pedido">
            <input
              type="date"
              value={form.fechaStr}
              onChange={(e) => onChange("fechaStr", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#6d4c41]/25 focus:outline-none focus:ring-2 focus:ring-[#c8e6c9]"
            />
          </Field>

          <Field label="Calle">
            <input
              value={form.calle}
              onChange={(e) => onChange("calle", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#6d4c41]/25 focus:outline-none focus:ring-2 focus:ring-[#c8e6c9]"
              placeholder="A / B / C..."
            />
          </Field>

          <Field label="Número">
            <input
              type="number"
              min={1}
              max={100}
              value={form.numero}
              onChange={(e) => onChange("numero", Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-[#6d4c41]/25 focus:outline-none focus:ring-2 focus:ring-[#c8e6c9]"
            />
          </Field>

          <Field label="Cantidad">
            <input
              type="number"
              min={1}
              value={form.cantidad}
              onChange={(e) => onChange("cantidad", Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-[#6d4c41]/25 focus:outline-none focus:ring-2 focus:ring-[#c8e6c9]"
            />
          </Field>

          <Field label="Precio unitario">
            <input
              type="number"
              min={0}
              value={form.precioUnitario}
              onChange={(e) => onChange("precioUnitario", Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-[#6d4c41]/25 focus:outline-none focus:ring-2 focus:ring-[#c8e6c9]"
            />
          </Field>

          <Field label="Estado">
            <select
              value={form.estado}
              onChange={(e) => onChange("estado", e.target.value as PedidoForm["estado"])}
              className="w-full px-4 py-2 rounded-xl border border-[#6d4c41]/25 focus:outline-none focus:ring-2 focus:ring-[#c8e6c9]"
            >
              <option value="pendiente">pendiente</option>
              <option value="entregado">entregado</option>
            </select>
          </Field>

          <div className="rounded-2xl bg-[#f5f1e8] border border-[#6d4c41]/25 p-4">
            <div className="text-sm font-bold text-[#6d4c41]">Total</div>
            <div className="text-2xl font-extrabold text-[#2f7d32]">
              ${total.toLocaleString("es-AR")}
            </div>
            <div className="text-xs text-[#6d4c41]/70 mt-1">
              (cantidad × precio unitario)
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={guardar}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#2f7d32] text-white font-bold hover:bg-[#256628] disabled:opacity-60 transition"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>

          {error && <span className="text-red-700 text-sm">{error}</span>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-bold text-[#6d4c41] mb-1">{label}</div>
      {children}
    </label>
  );
}
