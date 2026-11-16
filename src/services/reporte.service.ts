import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './auth.service';
import { Reporte, TipoReporte } from '../models/reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);

  crear(solicitudId: number, tipo: TipoReporte, descripcion: string): Observable<Reporte> {
    return this.http.post<Reporte>(`${API_URL}/requests/${solicitudId}/reports`, { tipo, descripcion });
  }

  listar(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${API_URL}/reportes`);
  }

  marcarRevisado(id: number): Observable<Reporte> {
    return this.http.patch<Reporte>(`${API_URL}/reportes/${id}/revisado`, {});
  }
}
