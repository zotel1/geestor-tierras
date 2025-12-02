"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const [user, setUser] = useState< User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
            if (!u && pathname !== "/login") {
                router.push("/login");
            }
        });

        return () => unsub();
    }, [router, pathname]);

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Cargando...</p>
            </div>
            );
    }

    if (!user && pathname !== "/login") {
        return null;
    }

    return <>{children}</>;
}