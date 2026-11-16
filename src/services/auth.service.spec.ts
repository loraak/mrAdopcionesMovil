import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

const b64url = (o: object) =>
  btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const tokenCon = (payload: object) =>
  `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.firma`;

class MemoriaStorage {
  private datos = new Map<string, string>();
  getItem(k: string) { return this.datos.has(k) ? this.datos.get(k)! : null; }
  setItem(k: string, v: string) { this.datos.set(k, String(v)); }
  removeItem(k: string) { this.datos.delete(k); }
  clear() { this.datos.clear(); }
}

describe('AuthService.isLoggedIn y decodeExp', () => {
  let ahora: number; // segundos
  let storage: MemoriaStorage;

  const crear = (token: string | null): AuthService => {
    if (token !== null) storage.setItem('mra_token', token);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: { post: vi.fn(), get: vi.fn() } }],
    });
    return TestBed.inject(AuthService);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-10T12:00:00Z')); // segundo exacto
    ahora = Date.now() / 1000;
    storage = new MemoriaStorage();
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('C0: sin almacenamiento disponible devuelve false y logout no falla', () => {
    vi.stubGlobal('localStorage', undefined);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    const svc = TestBed.inject(AuthService);
    expect(svc.isLoggedIn()).toBe(false);
    expect(() => svc.logout()).not.toThrow();
  });

  it('C1: sin token devuelve false', () => {
    expect(crear(null).isLoggedIn()).toBe(false);
  });

  it('C2: token mal formado devuelve false (cae en el catch)', () => {
    expect(crear('abc').isLoggedIn()).toBe(false);
  });

  it('C2b: payload que no es base64 válido devuelve false', () => {
    expect(crear('a.%%%.c').isLoggedIn()).toBe(false);
  });

  it('C3: payload sin exp devuelve false', () => {
    expect(crear(tokenCon({ sub: '1' })).isLoggedIn()).toBe(false);
  });

  it('C4: exp en el pasado devuelve false', () => {
    expect(crear(tokenCon({ exp: ahora - 60 })).isLoggedIn()).toBe(false);
  });

  it('C5: exp en el futuro devuelve true', () => {
    expect(crear(tokenCon({ exp: ahora + 3600 })).isLoggedIn()).toBe(true);
  });

  it('C6 límite: exp igual al instante actual devuelve false', () => {
    expect(crear(tokenCon({ exp: ahora })).isLoggedIn()).toBe(false);
  });

  it('logout borra la sesión', () => {
    const svc = crear(tokenCon({ exp: ahora + 3600 }));
    expect(svc.isLoggedIn()).toBe(true);
    svc.logout();
    expect(svc.isLoggedIn()).toBe(false);
    expect(storage.getItem('mra_token')).toBeNull();
  });
});
