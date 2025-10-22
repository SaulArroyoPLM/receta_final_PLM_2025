import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendacionesFavoritasComponet } from './recomendaciones-favoritas-componet';

describe('RecomendacionesFavoritasComponet', () => {
  let component: RecomendacionesFavoritasComponet;
  let fixture: ComponentFixture<RecomendacionesFavoritasComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionesFavoritasComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendacionesFavoritasComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
