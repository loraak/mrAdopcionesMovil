import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export type Rol = 'ADOPTANTE' | 'DONANTE';

export interface RegistroRequest {
  username: string;
  correo: string;
  contrasena: string;
  rol: Rol;
  telefono?: string;
  ocupacion?: string;
  locacion?: string;
  organizacion?: string;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  correo: string;
  rol: Rol;
  telefono?: string;
  ocupacion?: string;
  locacion?: string;
  organizacion?: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://Localhost:8080/api/auth';

  registrar(payload: RegistroRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/registro`, payload);
  }
}
