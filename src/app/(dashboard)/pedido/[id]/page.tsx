import PedidoDetailClient from '@/components/pedidos/PedidosDetailClient';

export default function PedidoPage({ params }: { params: { id: string } }) {
  return <PedidoDetailClient id={params.id} />;
}