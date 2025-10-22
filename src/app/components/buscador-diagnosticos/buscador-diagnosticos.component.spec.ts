import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuscadorDiagnosticosComponent } from './buscador-diagnosticos.component';

describe('BuscadorDiagnosticosComponent', () => {
  let component: BuscadorDiagnosticosComponent;
  let fixture: ComponentFixture<BuscadorDiagnosticosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorDiagnosticosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorDiagnosticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
