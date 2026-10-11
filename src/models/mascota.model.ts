export type MascotaTipo = 'perros' | 'gatos' | 'otros';
export type MascotaEstatus = 'Disponible' | 'En proceso' | 'Adoptado';

export interface Mascota {
  id: number;
  nombre: string;
  edad: number;
  tipo: MascotaTipo;
  descripcion: string;
  imagen: string | null;
  estatus: MascotaEstatus;
  etiquetas: string[];
}

export interface MascotaRequest {
  nombre: string;
  edad: number;
  tipo: MascotaTipo;
  descripcion: string;
  imagen: string;
  estatus?: MascotaEstatus;
  etiquetas: string[];
}
