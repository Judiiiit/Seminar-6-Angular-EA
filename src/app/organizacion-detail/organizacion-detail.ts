import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrganizacionService } from '../services/organizacion.service';
import { UsuarioService } from '../services/usuario.service';
import { Organizacion } from '../models/organizacion.model';
import { Usuario } from '../models/usuario.model';
import { OrgUserSyncComponent } from '../org-user-sync/org-user-sync';

@Component({
  selector: 'app-organizacion-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, OrgUserSyncComponent],
  templateUrl: './organizacion-detail.html',
  styleUrls: ['./organizacion-detail.css'],
})
export class OrganizacionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private organizacionService = inject(OrganizacionService);
  private usuarioService = inject(UsuarioService);

  organizacion: Organizacion | null = null;
  usuariosDisponibles: Usuario[] = [];
  loading = true;
  errorMsg = '';

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    if (!id) {
      this.errorMsg = 'No se ha encontrado el id.';
      this.loading = false;
      return;
    }

    this.cargarDetalle(id);
  });
}

  cargarDetalle(id: string): void {
    this.loading = true;
    this.errorMsg = '';

    forkJoin({
      organizaciones: this.organizacionService.getOrganizaciones(),
      usuariosOrg: this.organizacionService.getUsuariosDeOrganizacion(id),
      usuarios: this.usuarioService.getUsuarios(),
    }).subscribe({
      next: ({ organizaciones, usuariosOrg, usuarios }) => {
        const org = organizaciones.find(o => o._id === id);

        if (!org) {
          this.errorMsg = 'Organización no encontrada.';
          this.loading = false;
          return;
        }

        this.organizacion = {
          ...org,
          usuarios: usuariosOrg,
        };

        this.usuariosDisponibles = usuarios;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle:', err);
        this.errorMsg = 'No se ha podido cargar el detalle de la organización.';
        this.loading = false;
      },
    });
  }

  refrescar(): void {
    if (this.organizacion?._id) {
      this.cargarDetalle(this.organizacion._id);
    }
  }
}