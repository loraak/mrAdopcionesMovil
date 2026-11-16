import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { API_URL, AuthService } from './auth.service';

describe('authInterceptor', () => {
  const authMock = { token: vi.fn(), logout: vi.fn() };
  const routerMock = { navigate: vi.fn(), url: '/app/mascota' };
  let http: HttpClient;
  let ctrl: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();
    authMock.token.mockReturnValue(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => ctrl.verify());

  const fallar = (url: string, status: number, metodo: 'get' | 'post' = 'get') => {
    let error: any;
    const obs = metodo === 'get' ? http.get(url) : http.post(url, {});
    obs.subscribe({ error: (e) => (error = e) });
    ctrl.expectOne(url).flush({}, { status, statusText: 'Error' });
    return error;
  };

  it('I1: con token y URL de la API agrega Authorization', () => {
    authMock.token.mockReturnValue('tok');
    http.get(`${API_URL}/mascotas`).subscribe();
    const req = ctrl.expectOne(`${API_URL}/mascotas`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok');
    req.flush([]);
  });

  it('I2: sin token no agrega el encabezado', () => {
    http.get(`${API_URL}/mascotas`).subscribe();
    const req = ctrl.expectOne(`${API_URL}/mascotas`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('I3: con token pero URL externa no filtra el token', () => {
    authMock.token.mockReturnValue('tok');
    http.get('https://otro-dominio.com/datos').subscribe();
    const req = ctrl.expectOne('https://otro-dominio.com/datos');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('I4: 401 con token cierra sesión y redirige a /login con returnUrl', () => {
    authMock.token.mockReturnValue('tok');
    const error = fallar(`${API_URL}/solicitudes/mine`, 401);
    expect(error.status).toBe(401);
    expect(authMock.logout).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/app/mascota' } });
  });

  it('I5: 401 en /auth/login no cierra sesión', () => {
    authMock.token.mockReturnValue('tok');
    const error = fallar(`${API_URL}/auth/login`, 401, 'post');
    expect(error.status).toBe(401);
    expect(authMock.logout).not.toHaveBeenCalled();
  });

  it('I6: 401 sin token no cierra sesión', () => {
    const error = fallar(`${API_URL}/solicitudes/mine`, 401);
    expect(error.status).toBe(401);
    expect(authMock.logout).not.toHaveBeenCalled();
  });

  it('I7: error 500 se propaga sin cerrar sesión', () => {
    authMock.token.mockReturnValue('tok');
    const error = fallar(`${API_URL}/mascotas`, 500);
    expect(error.status).toBe(500);
    expect(authMock.logout).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
