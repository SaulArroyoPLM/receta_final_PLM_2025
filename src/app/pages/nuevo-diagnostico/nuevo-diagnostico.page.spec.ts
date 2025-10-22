import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoDiagnosticoPage } from './nuevo-diagnostico.page';

describe('NuevoDiagnosticoPage', () => {
  let component: NuevoDiagnosticoPage;
  let fixture: ComponentFixture<NuevoDiagnosticoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoDiagnosticoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
