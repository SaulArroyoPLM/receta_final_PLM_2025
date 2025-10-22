import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MedicineSearchComponent } from '../../components/medicamento-buscador-component/medicine-search-component';
import { MedicamentosCardsComponent } from '../../components/medicamentos-cards/medicamentos-cards.component';
import { MedicamentosService } from '../../services/medicamentos.service';
import { Medicamento } from '../../interfaces/medicamento.interface';
import { DoctorNameComponent } from '../../components/doctor-name/doctor-name.component';


@Component({
  selector: 'app-consultar-medicamentos',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    DashboardLayoutComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MedicineSearchComponent,
    MedicamentosCardsComponent,
    DoctorNameComponent
  ],
  templateUrl: './consultar-medicamentos.page.html',
  styleUrls: ['./consultar-medicamentos.page.scss'],
})
export class ConsultarMedicamentosPage implements OnInit {
  paciente: any;
  medicamentosFiltrados: Medicamento[] = [];
  terminoBusqueda?: string;
  filtroActivo = false;
  letraSeleccionada?: string;

  constructor(
    private router: Router,
    private medicamentosService: MedicamentosService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state;
    this.paciente = state?.['paciente'];

    if (state) {
      if (state['medicamento']) {
        const medicamento = state['medicamento'] as Medicamento;
        this.terminoBusqueda = state['filtro'] || medicamento.marca || medicamento.nombre;
        this.filtroActivo = true;
        this.filtrarPorMarcaNombre(this.terminoBusqueda ?? '');
      } else if (state['resultados']) {
        this.medicamentosFiltrados = state['resultados'] as Medicamento[];
        this.terminoBusqueda = state['terminoBusqueda'];
        this.filtroActivo = true;
      } else if (state['terminoBusqueda']) {
        this.terminoBusqueda = state['terminoBusqueda'];
        this.filtroActivo = true;
        this.buscarMedicamentos(this.terminoBusqueda ?? '');
      }
    }
  }

  ngOnInit(): void {
    if (!this.filtroActivo) {
      this.cargarTodosMedicamentos();
    }
  }

  onNavigationChange(event: {letter: string, page: number}) {
    this.letraSeleccionada = event.letter;
    this.limpiarFiltros();
    this.filtrarPorLetra(event.letter);
  }

  private filtrarPorMarcaNombre(termino: string): void {
    const terminoLower = termino.toLowerCase();
    const todos = this.medicamentosService.getMedicamentos();
    this.medicamentosFiltrados = todos.filter(med => {
      const marca = med.marca?.toLowerCase() ?? '';
      const nombre = med.nombre?.toLowerCase() ?? '';
      return marca.includes(terminoLower) || nombre.includes(terminoLower);
    });
  }

  private buscarMedicamentos(termino: string): void {
    const terminoLower = termino.toLowerCase();
    const todos = this.medicamentosService.getMedicamentos();
    this.medicamentosFiltrados = todos.filter(med => {
      const nombre = med.nombre?.toLowerCase() ?? med.marca?.toLowerCase() ?? '';
      const composicion = med.composicion?.toLowerCase() ?? med.sustancia?.toLowerCase() ?? '';
      const presentacion = med.presentacion?.toLowerCase() ?? '';
      return nombre.includes(terminoLower) ||
             composicion.includes(terminoLower) ||
             presentacion.includes(terminoLower);
    });
  }

  private filtrarPorLetra(letra: string): void {
    const todos = this.medicamentosService.getMedicamentos();
    this.medicamentosFiltrados = todos.filter(med => med.letra?.toUpperCase() === letra.toUpperCase());
  }

  private cargarTodosMedicamentos(): void {
    this.medicamentosFiltrados = [...this.medicamentosService.getMedicamentos()];
  }

  limpiarFiltros(): void {
    this.filtroActivo = false;
    this.terminoBusqueda = undefined;
    this.letraSeleccionada = undefined;
    this.cargarTodosMedicamentos();
  }

  volverABuscar(): void {
    this.router.navigate(['/']);
  }
}
