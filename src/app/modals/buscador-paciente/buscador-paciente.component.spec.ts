import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuscadorPacienteComponent } from './buscador-paciente.component';

describe('BuscadorPacienteComponent', () => {
  let component: BuscadorPacienteComponent;
  let fixture: ComponentFixture<BuscadorPacienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BuscadorPacienteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
