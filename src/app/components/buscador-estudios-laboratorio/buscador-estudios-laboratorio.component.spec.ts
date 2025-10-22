import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuscadorEstudiosLaboratorioComponent } from './buscador-estudios-laboratorio.component';

describe('BuscadorEstudiosLaboratorioComponent', () => {
  let component: BuscadorEstudiosLaboratorioComponent;
  let fixture: ComponentFixture<BuscadorEstudiosLaboratorioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorEstudiosLaboratorioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorEstudiosLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
