import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Organizacion } from '../models/organizacion.model';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-org-user-sync',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './org-user-sync.html',
  styleUrl: './org-user-sync.css',
})
export class OrgUserSyncComponent {
  private usuarioService = inject(UsuarioService);

  @Input() organizacion!: Organizacion;
  @Input() usuariosDisponibles: Usuario[] = [];
  @Output() actualizado = new EventEmitter<void>();

  usuarioSeleccionadoId = '';
  loading = false;
  errorMsg = '';
  infoMsg = '';

  get usuariosNoAsignados(): Usuario[] {
    const idsAsignados = new Set(this.organizacion.usuarios.map(u => u._id));
    return this.usuariosDisponibles.filter(u => !idsAsignados.has(u._id));
  }

  addUsuario(): void {
    if (!this.usuarioSeleccionadoId) return;

    const usuario = this.usuariosDisponibles.find(
      u => u._id === this.usuarioSeleccionadoId
    );
    if (!usuario) return;

    this.loading = true;
    this.errorMsg = '';
    this.infoMsg = '';

    this.usuarioService.updateUsuario(
      usuario._id,
      usuario.name,
      usuario.email,
      usuario.password ?? '',
      this.organizacion._id
    ).subscribe({
      next: () => {
        this.usuarioSeleccionadoId = '';
        this.loading = false;
        this.actualizado.emit();
      },
      error: () => {
        this.errorMsg = 'No se ha podido añadir el usuario a la organización.';
        this.loading = false;
      },
    });
  }

  quitarUsuario(_usuario: Usuario): void {
    this.infoMsg =
      'Con el backend actual no se puede quitar un usuario dejándolo sin organización, porque organizacion es obligatoria.';
  }
}