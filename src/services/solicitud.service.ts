import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './auth.service';
import { Solicitud } from '../models/solicitud.model';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/solicitudes`;

  /** Adoptante: pide adoptar una mascota. */
  crear(mascotaId: number, mensaje: string): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, { mascotaId, mensaje });
  }

  /** Adoptante: solicitudes que ha enviado. */
  getMias(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/mine`);
  }

  /** Donante: solicitudes que recibió en sus mascotas. */
  getRecibidas(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/recibidas`);
  }

  /** Donante: acepta o rechaza una solicitud. */
  cambiarEstatus(id: number, estatus: 'Aceptada' | 'Rechazada'): Observable<Solicitud> {
    return this.http.patch<Solicitud>(`${this.apiUrl}/${id}/estatus`, { estatus });
  }
}
