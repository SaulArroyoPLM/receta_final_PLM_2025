import { Injectable } from '@angular/core';
import { Medicamento } from '../interfaces/medicamento.interface';
import { Observable, of } from 'rxjs'; // ✅ Para retornar observable

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  private medicamentos: Medicamento[] = [
    {
      id: 1,
      marca: "ZYXEM",
      solucion: "TABLETA",
      chinoin: "Chinoin",
      sustancia: "LEVOCETIRIZINA",
      presentaciones: [
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
      ],
      indicacion: "Indicación terapéutica",
      dosis: "Dosis y vía de administración",
      imagen: "../assets/images/zyxem.png",
      imagenDetalle: "assets/images/zyxem_ipa.png",  
      link: "detalle-medicamento"
    },
     {
      id: 2,
      marca: "ZYXEM",
      solucion: "TABLETA",
      chinoin: "Chinoin",
      sustancia: "LEVOCETIRIZINA",
      presentaciones: [
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
      ],
      indicacion: "Indicación terapéutica",
      dosis: "Dosis y vía de administración",
      imagen: "../assets/images/zyxem.png",
      imagenDetalle: "assets/images/zyxem_ipa.png",  
      link: "detalle-medicamento"
    },
    {
      id: 3,
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
  ];

  constructor() {}

  getMedicamentos(): Medicamento[] {
    return this.medicamentos;
  }

  getMedicamentoById(id: number): Medicamento | undefined {
    return this.medicamentos.find(m => m.id === id);
  }

  // ✅ Método para buscar (filtro local por marca o sustancia)
  buscarMedicamentos(query: string): Observable<Medicamento[]> {
    if (!query) return of([]);
    
    const lowerQuery = query.toLowerCase();
    const resultados = this.medicamentos.filter(med => 
      (med.marca?.toLowerCase().includes(lowerQuery)) || 
      (med.sustancia?.toLowerCase().includes(lowerQuery))
    );
    return of(resultados);
  }
}