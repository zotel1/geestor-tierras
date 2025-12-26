"use client";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CALLES = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
);

const NUMEROS = Array.from({ length: 100 }, (_, i) => i + 1);


export default function NuevoPedidoClient() {

    const router = useRouter();

    const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    clienteNombre: "",
    calle: "A",
    numero: 1,
    cantidad: 1,
    precioUnitario: 0,
  });

  const total = useMemo(() => {
    return Number(form.cantidad) * Number(form.precioUnitario);
  }, [form.cantidad, form.precioUnitario]);

  const onChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const guardar = async () => {
    setError(null);

    if (form.cantidad <= 0) {
      setError("La cantidad debe ser mayor a 0.");
      return;
    }

    if (form.precioUnitario < 0) {
      setError("El precio no puede ser negativo.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "pedidos"), {
        clienteNombre: form.clienteNombre.trim()
          ? form.clienteNombre.trim()
          : null,
        calle: form.calle,
        numero: Number(form.numero),
        cantidad: Number(form.cantidad),
        precioUnitario: Number(form.precioUnitario),
        total,
        estado: "pendiente",
        fecha: serverTimestamp(),
      });

      setSaving(false);
      router.push("/");
    } catch (e: any) {
      setSaving(false);
      setError(e?.message ?? "Error al guardar el pedido.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#f5f1e8] border border-[#6d4c41]/25 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2f7d32]">
              ➕ Nuevo pedido
            </h1>
            <p className="text-[#6d4c41]/80 mt-1">
              Cargá un nuevo pedido de tierra abonada.
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white/60 border border-[#6d4c41]/20 text-[#6d4c41] font-semibold hover:bg-[#c8e6c9] hover:text-[#2f7d32] transition"
          >
            ← Volver
          </Link>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-[#6d4c41]/15 rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre (opcional)">
            <input
              value={form.clienteNombre}
              onChange={(e) => onChange("clienteNombre", e.target.value)}
              placeholder="Ej: Juan"
              className="input"
            />
          </Field>

          <Field label="Calle">
            <select
              value={form.calle}
              onChange={(e) => onChange("calle", e.target.value)}
              className="input"
            >
              {CALLES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Número">
            <select
              value={form.numero}
              onChange={(e) => onChange("numero", Number(e.target.value))}
              className="input"
            >
              {NUMEROS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Cantidad">
            <input
              type="number"
              min={1}
              value={form.cantidad}
              onChange={(e) => onChange("cantidad", Number(e.target.value))}
              className="input"
            />
          </Field>

          <Field label="Precio unitario">
            <input
              type="number"
              min={0}
              value={form.precioUnitario}
              onChange={(e) =>
                onChange("precioUnitario", Number(e.target.value))
              }
              className="input"
            />
          </Field>

          {/* Total */}
          <div className="rounded-2xl bg-[#f5f1e8] border border-[#6d4c41]/25 p-4 flex flex-col justify-center">
            <div className="text-sm font-bold text-[#6d4c41]">
              Total calculado
            </div>
            <div className="text-3xl font-extrabold text-[#2f7d32]">
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
            {saving ? "Guardando…" : "Guardar pedido"}
          </button>

          {error && <span className="text-red-700 text-sm">{error}</span>}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-sm font-bold text-[#6d4c41] mb-1">{label}</div>
      {children}
    </label>
  );
}