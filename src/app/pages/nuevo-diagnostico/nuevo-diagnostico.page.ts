import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BuscadorDiagnosticosComponent, Diagnostico } from '../../components/buscador-diagnosticos/buscador-diagnosticos.component';
import { BuscadorAlergiasComponent } from '../../components/buscador-alergias/buscador-alergias.component';
import { MedicineSearchComponent } from '../../components/medicamento-buscador-component/medicine-search-component';
import { BuscadorEstudiosLaboratorioComponent } from '../../components/buscador-estudios-laboratorio/buscador-estudios-laboratorio.component';
import { DrawerSignosVitalesComponent, DrawerSection, DrawerItem } from '../../components/drawer-signos-vitales/drawer-signos-vitales.component';
import { PacienteService, PacienteData } from '../../services/paciente.service'; // Corregí 'servise' a 'service'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nuevo-diagnostico',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    IonicModule,
    MatChipsModule,
    BuscadorDiagnosticosComponent,
    BuscadorAlergiasComponent,
    MedicineSearchComponent,
    BuscadorEstudiosLaboratorioComponent,
    ReactiveFormsModule,
    DrawerSignosVitalesComponent,
  ],
  templateUrl: './nuevo-diagnostico.page.html',
  styleUrls: ['./nuevo-diagnostico.page.scss'],
})
export class NuevoDiagnosticoPage implements OnInit {
  // Formulario
  miFormulario!: FormGroup;

  // Variables del Drawer
  isDrawerOpen = false;
  drawerTitle = 'Datos';
  warningMessage = 'Marca las opciones que deseas que se impriman en la receta médica. Si no, se guardará sólo en el perfil del paciente.';

  // Observable del paciente
  paciente$: Observable<PacienteData | null>;

  // Listas de selección
  diagnosticosSeleccionados: any[] = [];
  estudiosSeleccionados: any[] = [];

  // Listas de datos
  listaDiagnosticos: Diagnostico[] = [
    { id: '1', nombre: 'Migraña', cie10: 'G43', descripcion: 'Dolor de cabeza recurrente', categoria: 'Neurología' },
    { id: '2', nombre: 'Diarrea Tipo A', cie10: 'A09', descripcion: 'Diarrea infecciosa aguda', categoria: 'Gastroenterología' },
    { id: '3', nombre: 'Hipertensión', cie10: 'I10', descripcion: 'Presión arterial elevada', categoria: 'Cardiología' },
    { id: '4', nombre: 'Asma', cie10: 'J45', descripcion: 'Enfermedad respiratoria crónica', categoria: 'Neumología' },
    { id: '5', nombre: 'Diabetes Tipo 2', cie10: 'E11', descripcion: 'Alteración de glucosa', categoria: 'Endocrinología' },
  ];

  listaEstudios = [
    { id: '1', nombre: 'Hemograma', categoria: 'Sangre', descripcion: 'Conteo de células sanguíneas' },
    { id: '2', nombre: 'Glucosa', categoria: 'Bioquímica', descripcion: 'Nivel de azúcar en sangre' },
    { id: '3', nombre: 'Perfil lipídico', categoria: 'Bioquímica', descripcion: 'Colesterol y triglicéridos' },
  ];

  listaAlergias: Diagnostico[] = [
    { id: '1', nombre: 'Polen', cie10: 'T78.4', descripcion: 'Reacción al polen', categoria: 'Respiratoria' },
    { id: '2', nombre: 'Penicilina', cie10: 'T36.0', descripcion: 'Reacción al antibiótico', categoria: 'Medicamentos' },
    { id: '3', nombre: 'Mariscos', cie10: 'T78.1', descripcion: 'Reacción alimentaria', categoria: 'Alimentos' },
    { id: '4', nombre: 'Ácaros', cie10: 'T78.4', descripcion: 'Reacción ambiental', categoria: 'Dermatología' },
    { id: '5', nombre: 'Látex', cie10: 'T78.4', descripcion: 'Reacción por contacto', categoria: 'Dermatología' },
  ];

  diagnosticosPaciente: Diagnostico[] = [];

  drawerSections: DrawerSection[] = [
    {
      title: 'Antropométricos',
      icon: 'person',
      expanded: true,
      items: [],
    },
    {
      title: 'Signos vitales',
      icon: 'favorite',
      expanded: true,
      items: [],
    },
  ];

  datosRecopilados: {
    antropometricos: any[];
    signosVitales: any[];
  } = {
    antropometricos: [],
    signosVitales: [],
  };

  constructor(private router: Router, private pacienteService: PacienteService) {
    // Obtener el Observable del paciente desde el servicio
    this.paciente$ = this.pacienteService.paciente$;

    // Intentar obtener paciente desde la navegación
    const nav = this.router.getCurrentNavigation();
    const pacienteFromNav = nav?.extras?.state?.['paciente'] || null;
    if (pacienteFromNav) {
      this.pacienteService.setPaciente(pacienteFromNav);
    }
  }

  ngOnInit() {
    // Inicializar formulario
    this.miFormulario = new FormGroup({
      motivoConsulta: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    // Cargar datos existentes si los hay
    this.cargarDatosExistentes();

    // Debug: Suscribirse al Observable para ver los datos del paciente
    this.paciente$.subscribe(paciente => {
      console.log('🎯 Datos del paciente en diagnóstico:', paciente);
    });
  }

  // Resto de los métodos (sin cambios)
  getErrorMessage(controlName: string): string {
    const control = this.miFormulario.get(controlName);
    if (!control) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('minlength')) return 'Debe tener al menos 5 caracteres';
    return '';
  }

  alCambiarDiagnosticos(diagnosticos: Diagnostico[]) {
    console.log('Cambió la lista:', diagnosticos);
  }

  alSeleccionarDiagnostico(diagnostico: Diagnostico) {
    console.log('Seleccionó:', diagnostico.nombre);
  }

  alRemoverDiagnostico(diagnostico: Diagnostico) {
    console.log('Removió:', diagnostico.nombre);
  }

  guardarConsulta(diagnosticos: Diagnostico[]) {
    console.log('Guardando consulta con:', diagnosticos);
  }

  alHacerCambio(diagnosticos: Diagnostico[]) {
    console.log('Cantidad actual:', diagnosticos.length);
  }

  alCambiarAlergias(event: any[]) {
    console.log('Diagnósticos seleccionados:', event);
    this.diagnosticosSeleccionados = event;
  }

  alCambiarEstudios(event: any[]) {
    console.log('Estudios seleccionados:', event);
    this.estudiosSeleccionados = event;
  }

  abrirDrawerSignosVitales(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.prepararDatosDrawer();
    this.isDrawerOpen = true;
  }

  prepararDatosDrawer() {
    if (this.datosRecopilados.antropometricos.length > 0) {
      this.drawerSections[0].items = this.datosRecopilados.antropometricos;
    } else {
      this.drawerSections[0].items = [
        { label: 'Estatura', value: '', icon: 'height', selected: false, unit: 'm' },
        { label: 'Peso', value: '', icon: 'monitor_weight', selected: false, unit: 'kg' },
        { label: 'IMC', value: '', icon: 'analytics', selected: false },
      ];
    }

    if (this.datosRecopilados.signosVitales.length > 0) {
      this.drawerSections[1].items = this.datosRecopilados.signosVitales;
    } else {
      this.drawerSections[1].items = [
        { label: 'TAS', value: '', icon: 'show_chart', selected: false, unit: 'mmHg' },
        { label: 'TAD', value: '', icon: 'show_chart', selected: false, unit: 'mmHg' },
        { label: 'FC', value: '', icon: 'favorite', selected: false, unit: 'lpm' },
        { label: 'FR', value: '', icon: 'air', selected: false, unit: 'rpm' },
        { label: 'Temperatura', value: '', icon: 'thermostat', selected: false, unit: '°C' },
        { label: 'SpO₂', value: '', icon: 'water_drop', selected: false, unit: '%' },
      ];
    }
  }

  cerrarDrawer() {
    this.isDrawerOpen = false;
  }

  onAgregarDatos(selectedItems: DrawerItem[]) {
    console.log('Datos seleccionados:', selectedItems);
    this.guardarDatosSeleccionados(selectedItems);
    this.mostrarMensajeExito(selectedItems.length);
    this.cerrarDrawer();
  }

  guardarDatosSeleccionados(items: DrawerItem[]) {
    const antropometricos = ['Estatura', 'Peso', 'IMC'];
    items.forEach(item => {
      if (antropometricos.includes(item.label)) {
        const index = this.datosRecopilados.antropometricos.findIndex(d => d.label === item.label);
        if (index >= 0) {
          this.datosRecopilados.antropometricos[index] = item;
        } else {
          this.datosRecopilados.antropometricos.push(item);
        }
      } else {
        const index = this.datosRecopilados.signosVitales.findIndex(d => d.label === item.label);
        if (index >= 0) {
          this.datosRecopilados.signosVitales[index] = item;
        } else {
          this.datosRecopilados.signosVitales.push(item);
        }
      }
    });
    console.log('Datos guardados:', this.datosRecopilados);
  }

  cargarDatosExistentes() {
    // Implementar lógica para cargar datos si es necesario
  }

  mostrarMensajeExito(cantidad: number) {
    alert(`Se agregaron ${cantidad} dato(s) a la receta médica`);
  }

  onItemModificado(event: { section: string; item: DrawerItem }) {
    console.log('Item modificado:', event);
  }
}