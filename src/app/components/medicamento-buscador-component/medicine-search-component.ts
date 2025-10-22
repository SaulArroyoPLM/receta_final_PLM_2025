import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Medicamento } from '../../interfaces/medicamento.interface';

@Component({
  selector: 'app-medicine-search',
  standalone: true,
  templateUrl: './medicine-search-component.html',
  styleUrls: ['./medicine-search-component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    RouterModule
  ]
})
export class MedicineSearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  filteredMedicamentos!: Observable<Medicamento[]>;
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  medicamentos: Medicamento[] = [
    {
      id: 1,
      marca: "ZYXEM",
      solucion: "TABLETA",
      chinoin: "Chinoin",
      sustancia: "LEVOCETIRIZINA",
      presentaciones: [
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 60 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 5 mg"
      ],
      indicacion: "Indicación terapéutica",
      dosis: "Dosis y vía de administración",
      imagen: "../assets/images/zyxem.png",
      imagenDetalle: "assets/images/zyxem_ipa.png",  
      link: "detalle-medicamento",
      ippaInfo: {
        descripcionPropiedades: {
          propiedadesFarmaceuticas: 'Antihistamínico de segunda generación',
          composicion: 'Cada comprimido contiene: Levocetirizina diclorhidrato 5 mg',
          presentacion: '30 comprimidos recubiertos de 5 mg',
          almacenamiento: 'Consérvese a temperatura ambiente a no más de 30°C y en lugar seco'
        },
        usoSeguridad: {
          indicacionesTerapeuticas: 'Tratamiento de los síntomas de rinitis alérgica y urticaria',
          dosisViaAdministracion: 'Adultos y niños mayores de 12 años: 1 comprimido al día',
          contraindicaciones: 'Hipersensibilidad a levocetirizina o cetirizina',
          restriccionesEmbarazo: 'No se recomienda durante el embarazo',
          precauciones: 'Precaución en pacientes con insuficiencia renal',
          leyendasProteccion: 'No se deje al alcance de los niños'
        },
        efectosRiesgos: {
          reaccionesAdversas: 'Somnolencia, fatiga, sequedad de boca',
          interacciones: 'Puede potenciar efectos del alcohol',
          hallazgosLaboratorio: 'No se han reportado alteraciones significativas',
          sobredosificacion: 'En caso de sobredosis, contactar al centro toxicológico'
        }
      }
    },
    {
      id: 2,
      marca: "LIPITOR",
      solucion: "Tableta", 
      chinoin: "VIATRIS",
      sustancia: "ATORVASTATINA",
      presentaciones: [
        "1 Caja, 20 Tabletas, 10 mg",
        "1 Caja, 30 Tabletas, 10 mg",
        "1 Caja, 15 Tabletas, 20 mg",
        "1 Caja, 30 Tabletas, 20 mg",
        "1 Caja, 30 Tabletas, 40 mg",
        "1 Caja, 1 Frasco(s), 30 Tabletas, 80 mg",
        "2 Caja, 30 Tabletas, 10 mg",
        "2 Caja, 30 Tabletas, 20 mg",
        "2 Caja, 30 Tabletas, 40 mg",
        "2 Caja, 2 Frasco(s), 30 Tabletas, 80 mg",
        
      ],
      indicacion: "Indicación terapéutica",
      dosis: "Dosis y vía de administración",
      imagen: "../assets/images/LIPITOR.png",
      imagenDetalle: "assets/images/LIPITOR_ipa.png",  
      link: "detalle-medicamento"
    },




    {
      id: 3,
      nombre: 'Ferranina Fol Grageas',
      presentacion: '1 Caja, 60 Grageas',
      composicion: 'Vitamina B9 (Ácido Fólico) | Hierro',
      contenido: '60 grageas',
      imagen: 'assets/images/Imagen_53.png',
      imagenDetalle: 'assets/images/ferranina_fol_detalle.png',
      ippaInfo: {
        descripcionPropiedades: {
          propiedadesFarmaceuticas: 'Suplemento de hierro y ácido fólico',
          composicion: 'Hierro elemental 60 mg, Ácido fólico 400 mcg',
          presentacion: '60 grageas',
          almacenamiento: 'Temperatura ambiente'
        },
        usoSeguridad: {
          indicacionesTerapeuticas: 'Prevención y tratamiento de anemia ferropénica',
          dosisViaAdministracion: '1 gragea al día',
          contraindicaciones: 'Hemocromatosis',
          restriccionesEmbarazo: 'Seguro durante embarazo',
          precauciones: 'Tomar con alimentos',
          leyendasProteccion: 'Mantener fuera del alcance de los niños'
        },
        efectosRiesgos: {
          reaccionesAdversas: 'Molestias gastrointestinales',
          interacciones: 'No tomar con antiácidos',
          hallazgosLaboratorio: 'Puede oscurecer las heces',
          sobredosificacion: 'Consultar al médico inmediatamente'
        }
      }
    },
    {
      id: 4,
      nombre: 'Ferranina Complex Tabletas',
      presentacion: '1 Caja, 1 Envase(s) de burbuja, 30 Tabletas',
      composicion: 'Vitamina B9 (Ácido Fólico) | Complejo B | Vitamina B2 (Rivoflavina) | Vitamina B3 (Nicotínico, Ácido,...)',
      contenido: '30 tabletas',
      imagen: './assets/images/med_02.png',
      imagenDetalle: './assets/images/med_02_detalle.png'
    },
    {
      id: 5,
      nombre: 'Ferrexel',
      presentacion: '1 Caja, 1 Envase(s) de burbuja, 60 Cápsulas, 0.585 Miligramos',
      composicion: 'Hierro liposomado y ácido fólico',
      contenido: '60 cápsulas',
      imagen: './assets/images/Imagen_52.png',
      imagenDetalle: './assets/images/Imagen_52_detalle.png'
    },
    {
      id: 6,
      nombre: 'Ferricol Suspensión',
      presentacion: '1 Frasco con pipeta dosificadora, 45mL, 600/10 mg/mg',
      composicion: 'Hierro | Ácido Fólico',
      contenido: '45mL',
      imagen: './assets/images/Imagen_53.png',
      imagenDetalle: './assets/images/ferricol_detalle.png'
    },
    {
      id: 7,
      nombre: 'Paracetamol',
      presentacion: '1 Caja, 20 Tabletas, 500mg',
      composicion: 'Paracetamol',
      contenido: '20 tabletas',
      imagen: './assets/images/Imagen-55.png',
      imagenDetalle: './assets/images/Imagen-55_detalle.png'
    },
    {
      id: 8,
      nombre: 'Ibuprofeno',
      presentacion: '1 Caja, 24 Cápsulas, 400mg',
      composicion: 'Ibuprofeno',
      contenido: '24 cápsulas',
      imagen: './assets/images/Imagen_53.png',
      imagenDetalle: './assets/images/ibuprofeno_detalle.png'
    },
    {
      id: 9,
      nombre: 'Aspirina',
      presentacion: '1 Frasco, 100 Tabletas, 325mg',
      composicion: 'Ácido acetilsalicílico',
      contenido: '100 tabletas',
      imagen: './assets/images/Imagen_53.png',
      imagenDetalle: './assets/images/aspirina_detalle.png'
    }
  ];

  ngOnInit(): void {
    this.initializeSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSearch(): void {
    this.filteredMedicamentos = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => this._filter(this.getSearchValue(value))),
      takeUntil(this.destroy$)
    );
  }

  private getSearchValue(value: string | Medicamento | null): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object' && 'nombre' in value) {
      return value.nombre ?? value.marca ?? '';
    }
    return '';
  }

  private _filter(value: string): Medicamento[] {
    if (!value || value.trim().length === 0) {
      return this.medicamentos;
    }

    const filterValue = value.toLowerCase().trim();
    return this.medicamentos.filter(medicamento => {
      const nombre = medicamento.nombre?.toLowerCase() ?? medicamento.marca?.toLowerCase() ?? '';
      const composicion = medicamento.composicion?.toLowerCase() ?? medicamento.sustancia?.toLowerCase() ?? '';
      const presentacion = medicamento.presentacion?.toLowerCase() ?? '';
      
      return nombre.includes(filterValue) ||
             composicion.includes(filterValue) ||
             presentacion.includes(filterValue);
    });
  }

  // ✅ Navega a consultar-medicamentos con el medicamento seleccionado
  onMedicamentoSelected(medicamento: Medicamento): void {
    console.log('Medicamento seleccionado:', medicamento);
    
    // Navega pasando el medicamento como state
    this.router.navigate(['/consultar-medicamentos'], {
      state: { 
        medicamento: medicamento,
        filtro: medicamento.marca ?? medicamento.nombre
      }
    });
  }

  displayFn = (medicamento: Medicamento | null): string => {
    if (!medicamento) return '';
    return medicamento.nombre ?? medicamento.marca ?? '';
  };
  
  ejecutarBusqueda(): void {
    const searchValue = this.getSearchValue(this.searchControl.value);
    console.log('Ejecutando búsqueda:', searchValue);
    
    if (searchValue.trim().length > 0) {
      const resultados = this._filter(searchValue);
      console.log('Resultados encontrados:', resultados.length);
    }
  }

  limpiarBusqueda(): void {
    this.searchControl.setValue('');
    this.searchControl.markAsUntouched();
    console.log('Búsqueda limpiada');
  }

  trackByMedicamento(index: number, medicamento: any): string {
    return medicamento.id || index;
  }

  verTodo(): void {
    this.router.navigate(['/consultar-medicamentos']);
  }
}