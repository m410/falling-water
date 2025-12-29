import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadedImage {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly http = inject(HttpClient);

  uploadImage(file: File): Observable<UploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadedImage>('/api/images', formData);
  }
}
