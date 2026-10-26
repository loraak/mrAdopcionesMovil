import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './auth.service';
import { ChatInfo, Mensaje } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/requests`;

  getInfo(solicitudId: number): Observable<ChatInfo> {
    return this.http.get<ChatInfo>(`${this.apiUrl}/${solicitudId}/chat`);
  }

  /** Mensajes con id mayor a "after" (0 = todos los visibles). */
  getMensajes(solicitudId: number, after = 0): Observable<Mensaje[]> {
    const params = new HttpParams().set('after', after);
    return this.http.get<Mensaje[]>(`${this.apiUrl}/${solicitudId}/messages`, { params });
  }

  enviar(solicitudId: number, contenido: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/${solicitudId}/messages`, { contenido });
  }

  limpiar(solicitudId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${solicitudId}/messages/clear`, {});
  }
}
