export type TipoReporte = 'TECNICO' | 'USUARIO';

export interface Reporte {
  id: number;
  solicitudId: number;
  mascotaNombre: string;
  tipo: TipoReporte;
  reportanteNombre: string;
  reportadoNombre: string | null;
  descripcion: string;
  estatus: 'Pendiente' | 'Revisado';
  fecha: string;
}
