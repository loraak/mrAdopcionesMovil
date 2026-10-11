export type EstatusSolicitud = 'Pendiente' | 'Aceptada' | 'Rechazada';

export interface Solicitud {
  id: number;
  mascotaId: number;
  mascotaNombre: string;
  solicitanteNombre: string;
  email: string;
  telefono: string | null;
  ubicacion: string | null;
  mensaje: string;
  estatus: EstatusSolicitud;
  fecha: string;
}
