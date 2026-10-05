import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Observable } from 'rxjs';
import { API_URL } from './auth.service';

export interface FotoTomada {
  blob: Blob;
  previewUrl: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);

  async tomarFoto(): Promise<FotoTomada | null> {
    try {
      const foto = await Camera.getPhoto({
        quality: 70,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        correctOrientation: true
      });

      const respuesta = await fetch(foto.webPath!);
      const original = await respuesta.blob();
      const blob = original.type ? original : new Blob([original], { type: 'image/jpeg' });

      return { blob, previewUrl: foto.webPath! };
    } catch (e: any) {
      if (String(e?.message ?? e).toLowerCase().includes('cancel')) return null;
      throw e;
    }
  }

  subirFotoMascota(blob: Blob): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', blob, 'mascota.jpg');
    return this.http.post<{ url: string }>(`${API_URL}/uploads/pets`, formData);
  }
}
