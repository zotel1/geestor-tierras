"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMensaje("Ingreso correcto ✔");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setMensaje("Error al iniciar sesión");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMensaje("Sesión cerrada");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow rounded p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Iniciar sesión
        </h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2"
          >
            Entrar
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="w-full mt-3 border rounded py-2 text-sm"
        >
          Cerrar sesión
        </button>

        {mensaje && <p className="mt-3 text-center text-sm">{mensaje}</p>}
      </div>
    </div>
  );
}
