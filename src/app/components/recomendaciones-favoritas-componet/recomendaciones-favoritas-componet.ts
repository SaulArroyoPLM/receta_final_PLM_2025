import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'; // ¡Importante! Agregar esta importación

interface RecomendacionesFavorita {
  nombre: string;
  icono: string;
  id?: number; // Opcional para identificar la recomendación
}

@Component({
  selector: 'app-recomendaciones-favoritas-componet',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule // ¡Importante! Agregar MatMenuModule a los imports
  ],
  templateUrl: './recomendaciones-favoritas-componet.html',
  styleUrl: './recomendaciones-favoritas-componet.scss'
})
export class RecomendacionesFavoritaComponet implements OnInit {
  displayedColumns: string[] = ['icono', 'nombre', 'receta_acciones'];

  recetasFavoritas: RecomendacionesFavorita[] = [
    { id: 1, nombre: 'Dieta dash', icono: 'add_notes' },
    { id: 2, nombre: 'Dieta mediterránea', icono: 'add_notes' },
    { id: 3, nombre: 'Lactancia', icono: 'add_notes' },
    { id: 4, nombre: 'Diarrea', icono: 'add_notes' }
  ];

  ngOnInit() {}

  // Métodos para manejar las acciones del menú
  onEditarRecomendacion(recomendacion: RecomendacionesFavorita, event: Event) {
    event.stopPropagation();
    console.log('Editando recomendación:', recomendacion);
    // Aquí puedes agregar la lógica para editar la recomendación
    // Por ejemplo, abrir un modal o navegar a una página de edición
  }

  onDuplicarRecomendacion(recomendacion: RecomendacionesFavorita, event: Event) {
    event.stopPropagation();
    console.log('Duplicando recomendación:', recomendacion);
    // Lógica para duplicar la recomendación
    const nuevaRecomendacion: RecomendacionesFavorita = {
      ...recomendacion,
      id: this.recetasFavoritas.length + 1,
      nombre: `${recomendacion.nombre} (Copia)`
    };
    this.recetasFavoritas.push(nuevaRecomendacion);
  }

  onEliminarRecomendacion(recomendacion: RecomendacionesFavorita, event: Event) {
    event.stopPropagation();
    console.log('Eliminando recomendación:', recomendacion);
    // Lógica para eliminar la recomendación
    if (confirm(`¿Estás seguro de que quieres eliminar la recomendación "${recomendacion.nombre}"?`)) {
      this.recetasFavoritas = this.recetasFavoritas.filter(r => r.id !== recomendacion.id);
    }
  }
}