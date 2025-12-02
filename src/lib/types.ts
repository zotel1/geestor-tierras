import { Timestamp } from "firebase/firestore";

export type EstadoPedido = "pendiente" | "entregado";

export type Pedido = {
    id: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
    fecha: Timestamp;
    estado: EstadoPedido;
    calle: string;
    numero: number;
    clienteNombre?: string;
};