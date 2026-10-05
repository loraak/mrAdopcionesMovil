import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './auth.service';
import {Mascota, MascotaRequest} from "../models/mascota.model";

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/mascotas`;

  /** Catálogo público: el backend ya devuelve solo las disponibles. */
  getMascotas(tipo?: string): Observable<Mascota[]> {
    let params = new HttpParams();
    if (tipo && tipo !== 'todos') {
      params = params.set('tipo', tipo); // el backend espera "tipo", no "type"
    }
    return this.http.get<Mascota[]>(this.apiUrl, { params });
  }

  getMascotaById(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`);
  }

  /** Mascotas del donante con sesión iniciada (todos los estatus). */
  getMisMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/mine`);
  }

  createMascota(mascota: MascotaRequest): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, mascota);
  }

  updateMascota(id: number, mascota: MascotaRequest): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/${id}`, mascota);
  }

  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
