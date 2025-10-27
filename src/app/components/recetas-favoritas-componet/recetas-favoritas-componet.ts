import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'; // ¡Importante! Agregar esta importación

interface RecetaFavorita {
  nombre: string;
  icono: string;
  id?: number; // Opcional para identificar la receta
}

@Component({
  selector: 'app-recetas-favoritas',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule // ¡Importante! Agregar MatMenuModule a los imports
  ],
  templateUrl: './recetas-favoritas-componet.html',
  styleUrls: ['./recetas-favoritas-componet.scss']
})
export class RecetasFavoritasComponent implements OnInit {
  displayedColumns: string[] = ['icono', 'nombre', 'receta_acciones'];

  recetasFavoritas: RecetaFavorita[] = [
    { id: 1, nombre: 'Resfriado común', icono: 'add_notes' },
    { id: 2, nombre: 'Lumbalgia aguda', icono: 'add_notes' },
    { id: 3, nombre: 'Migraña', icono: 'add_notes' },
    { id: 4, nombre: 'Diarrea', icono: 'add_notes' }
  ];

  ngOnInit() {}

  // Métodos para manejar las acciones del menú
  onEditarReceta(receta: RecetaFavorita, event: Event) {
    event.stopPropagation();
    console.log('Editando receta:', receta);
    // Aquí puedes agregar la lógica para editar la receta
    // Por ejemplo, abrir un modal o navegar a una página de edición
  }

  onDuplicarReceta(receta: RecetaFavorita, event: Event) {
    event.stopPropagation();
    console.log('Duplicando receta:', receta);
    // Lógica para duplicar la receta
    const nuevaReceta: RecetaFavorita = {
      ...receta,
      id: this.recetasFavoritas.length + 1,
      nombre: `${receta.nombre} (Copia)`
    };
    this.recetasFavoritas.push(nuevaReceta);
  }

  onEliminarReceta(receta: RecetaFavorita, event: Event) {
    event.stopPropagation();
    console.log('Eliminando receta:', receta);
    // Lógica para eliminar la receta
    if (confirm(`¿Estás seguro de que quieres eliminar la receta "${receta.nombre}"?`)) {
      this.recetasFavoritas = this.recetasFavoritas.filter(r => r.id !== receta.id);
    }
  }
}