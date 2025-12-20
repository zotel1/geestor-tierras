import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <Navbar />
            <main className="pt-16 px-4 max-w-6xl mx-auto">{children}</main>
        </ProtectedRoute>
    );
}