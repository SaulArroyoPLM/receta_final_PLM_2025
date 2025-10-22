import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarPacienteComponent } from './agregar-paciente.component';

describe('AgregarPacienteComponent', () => {
  let component: AgregarPacienteComponent;
  let fixture: ComponentFixture<AgregarPacienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AgregarPacienteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
