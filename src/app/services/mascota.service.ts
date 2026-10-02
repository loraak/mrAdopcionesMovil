import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Injectable, inject } from '@angular/core';

// decorador para hacer un servicio inyectable.
// crea una instancia única de este servicio y la inyecta al componente que la pida.
// root define que el servicio es un singleton
@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private apiUrl = 'http://localhost:8080/api/pets';

  // en vez de un constructor, se inyecta usando inject (xd)
  private http: HttpClient = inject(HttpClient);

  getMascotas(tipo?: string): Observable<any[]> {
    const url = tipo && tipo !== 'todos' ? `${this.apiUrl}?type=${tipo}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  getMascotasByDonante(donanteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/donante/${donanteId}`);
  }

  updateMascota(id: number, mascota: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, mascota);
  }
}
