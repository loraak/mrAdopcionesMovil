import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { LoginPage } from './login.page';
import { AuthService } from '../../services/auth.service';

describe('LoginPage.onLogin', () => {
  let page: LoginPage;
  const auth = { login: vi.fn() };
  const router = { navigateByUrl: vi.fn() };
  const toast = { create: vi.fn().mockResolvedValue({ present: vi.fn() }) };
  const returnUrl = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    returnUrl.mockReturnValue(null);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: returnUrl } } } },
        { provide: ToastController, useValue: toast },
      ],
    });
    page = TestBed.runInInjectionContext(() => new LoginPage());
  });

  const intentar = (usuario: string, clave: string) => {
    page.username = usuario;
    page.password = clave;
    page.onLogin();
  };

  it('P1: ignora el envío si ya hay una petición en curso', () => {
    page.loading = true;
    page.onLogin();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('P2: usuario vacío o solo espacios no llama al servidor', () => {
    intentar('   ', 'abc');
    expect(page.errorMessage).toBe('Ingresa tu usuario y contraseña.');
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('P3: contraseña vacía no llama al servidor', () => {
    intentar('ana', '');
    expect(page.errorMessage).toBe('Ingresa tu usuario y contraseña.');
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('P4 límite: usuario de 101 se rechaza y de 100 se acepta', () => {
    auth.login.mockReturnValue(of({ token: 't', user: { username: 'x' } }));
    intentar('a'.repeat(101), 'abc');
    expect(page.errorMessage).toBe('Los datos ingresados no son válidos.');
    expect(auth.login).not.toHaveBeenCalled();

    intentar('a'.repeat(100), 'abc');
    expect(auth.login).toHaveBeenCalledTimes(1);
  });

  it('P5 límite: contraseña de 73 se rechaza y de 72 se acepta', () => {
    auth.login.mockReturnValue(of({ token: 't', user: { username: 'x' } }));
    intentar('ana', 'p'.repeat(73));
    expect(auth.login).not.toHaveBeenCalled();

    intentar('ana', 'p'.repeat(72));
    expect(auth.login).toHaveBeenCalledTimes(1);
  });

  it('P6: datos válidos inician sesión, borran la contraseña y van al inicio', () => {
    auth.login.mockReturnValue(of({ token: 't', user: { username: 'ana' } }));
    intentar('  ana  ', 'secreta123');
    expect(auth.login).toHaveBeenCalledWith({ username: 'ana', contrasena: 'secreta123' });
    expect(page.password).toBe('');
    expect(page.loading).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/app/home');
  });

  it('destino: acepta una ruta interna de returnUrl', () => {
    returnUrl.mockReturnValue('/app/chat/5');
    auth.login.mockReturnValue(of({ token: 't', user: { username: 'ana' } }));
    intentar('ana', 'secreta123');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/app/chat/5');
  });

  it.each(['//evil.com', 'https://evil.com', 'app/home'])(
    'destino: rechaza la redirección %s y usa el inicio',
    (url) => {
      returnUrl.mockReturnValue(url);
      auth.login.mockReturnValue(of({ token: 't', user: { username: 'ana' } }));
      intentar('ana', 'secreta123');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/app/home');
    }
  );

  it.each([
    [0, 'No se pudo conectar con el servidor. Revisa tu conexión.'],
    [400, 'Usuario o contraseña incorrectos.'],
    [401, 'Usuario o contraseña incorrectos.'],
    [500, 'Ocurrió un error. Intenta de nuevo más tarde.'],
    [404, 'No fue posible iniciar sesión.'],
  ])('P7: el error %i muestra un mensaje genérico y borra la contraseña', (status, mensaje) => {
    auth.login.mockReturnValue(throwError(() => ({ status })));
    intentar('ana', 'secreta123');
    expect(page.errorMessage).toBe(mensaje);
    expect(page.password).toBe('');
    expect(page.loading).toBe(false);
  });
});
