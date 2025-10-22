import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IpaComponent } from './Ipa.component';

describe('NuevoMedicamentoComponent', () => {
  let component: IpaComponent;
  let fixture: ComponentFixture<IpaComponent >;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IpaComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(IpaComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
