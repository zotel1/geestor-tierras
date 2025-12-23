import PedidoDetailClient from '@/components/pedidos/PedidoDetailClient';

export default function PedidoPage({ params }: { params: { id: string } }) {
  return <PedidoDetailClient id={params.id} />;
}