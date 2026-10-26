export interface Mensaje {
  id: number;
  emisorNombre: string;
  propio: boolean;
  contenido: string;
  fecha: string;
}

export interface ChatInfo {
  solicitudId: number;
  mascotaId: number;
  mascotaNombre: string;
  miNombre: string;
  otroNombre: string;
}
