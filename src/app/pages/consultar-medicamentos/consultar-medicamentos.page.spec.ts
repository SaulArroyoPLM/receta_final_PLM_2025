import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarMedicamentosPage } from './consultar-medicamentos.page';

describe('ConsultarMedicamentosPage', () => {
  let component: ConsultarMedicamentosPage;
  let fixture: ComponentFixture<ConsultarMedicamentosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarMedicamentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
