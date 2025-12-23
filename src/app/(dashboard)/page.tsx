import PedidosList from "@/components/PedidosList";

export default function DashboardPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#2f7d32]">
          🌱 Gestor de Tierras Abonadas
        </h1>
        <PedidosList />
      </div>
    );
}