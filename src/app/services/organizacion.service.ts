import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Organizacion } from '../models/organizacion.model';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrganizaciones(): Observable<Organizacion[]> {
    return this.http
      .get<any>(`${this.baseUrl}/organizaciones`)
      .pipe(map(res => Array.isArray(res) ? res : res.organizaciones ?? []));
  }

  getUsuariosDeOrganizacion(id: string): Observable<Usuario[]> {
    return this.http
      .get<any>(`${this.baseUrl}/organizaciones/${id}/usuarios`)
      .pipe(map(res => Array.isArray(res) ? res : res.usuarios ?? []));
  }

  createOrganizacion(name: string): Observable<Organizacion> {
    return this.http.post<Organizacion>(`${this.baseUrl}/organizaciones`, { name });
  }

  updateOrganizacion(id: string, name: string): Observable<Organizacion> {
    return this.http.put<Organizacion>(`${this.baseUrl}/organizaciones/${id}`, { name });
  }

  deleteOrganizacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/organizaciones/${id}`);
  }
}