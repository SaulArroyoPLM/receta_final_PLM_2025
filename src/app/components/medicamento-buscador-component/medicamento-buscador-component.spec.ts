import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentoBuscadorComponent } from './medicine-search-component';

describe('MedicamentoBuscadorComponent', () => {
  let component: MedicamentoBuscadorComponent;
  let fixture: ComponentFixture<MedicamentoBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoBuscadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentoBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
