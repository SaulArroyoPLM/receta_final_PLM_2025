import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { IpaComponent } from '../../modals/Ipa.component/ipa.component';
import { Medicamento } from '../../interfaces/medicamento.interface';
import { MedicamentosService } from '../../services/medicamentos.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-medicamentos-cards',
  templateUrl: './medicamentos-cards.component.html',
  styleUrls: ['./medicamentos-cards.component.scss']
})
export class MedicamentosCardsComponent implements OnInit {
  @Input() medicamentos: Medicamento[] = [];
  @Input() loading: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private medicamentosService: MedicamentosService // ← Inyectamos el servicio
  ) {}

  ngOnInit() {
    if (this.medicamentos.length === 0) {
      this.medicamentos = this.medicamentosService.getMedicamentos();
    }
  }

  navigateToMedicamento(medicamento: Medicamento) {
    const dialogRef = this.dialog.open(IpaComponent, {
      data: { medicamento },
      width: '90vw',
      maxWidth: '890px',
      maxHeight: '100vh',
      panelClass: 'modal-medicamento',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog cerrado con:', result);
      }
    });
  }

  onKeyPress(event: KeyboardEvent, medicamento: Medicamento) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToMedicamento(medicamento);
    }
  }

  trackByMedicamento(index: number, medicamento: any): string {
    return medicamento.id || index;
  }
}
