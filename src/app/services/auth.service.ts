import {computed, inject, Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";

export const API_URL = 'http://localhost:8080/api';
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

export interface LoginRequest {
  username: string;
  contrasena: string;
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

export interface LoginResponse {
  token: string;
  user: UsuarioResponse;
}

const TOKEN_KEY = 'mra_token';
const USER_KEY = 'mra_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/auth`;

  private _token = signal<string | null>(this.readStorage(TOKEN_KEY));
  private _user = signal<UsuarioResponse | null> (this.readUser());

  readonly token = this._token.asReadonly();
  readonly currentUser = this._user.asReadonly();

  private tokenExp = computed(() => this.decodeExp(this._token()));

  isLoggedIn(): boolean {
    const exp = this.tokenExp();
    return !!this._token() && exp !== null && exp * 1000 > Date.now();
  }

  registrar(payload: RegistroRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/registro`, payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, payload)
      .pipe(tap((res) => this.saveSession(res)));
  }

  me(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`);
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  }

  private saveSession(res: LoginResponse): void {
    this._token.set(res.token);
    this._user.set(res.user);
    try {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    } catch {}
  }

  private readStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private readUser(): UsuarioResponse | null {
    const raw = this.readStorage(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UsuarioResponse;
    } catch {
      return null;
    }
  }

  private decodeExp(token: string | null): number | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload)).exp ?? null;
    } catch {
      return null;
    }
  }
}
