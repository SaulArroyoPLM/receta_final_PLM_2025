import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetasFavoritasComponet } from './recetas-favoritas-componet';

describe('RecetasFavoritasComponet', () => {
  let component: RecetasFavoritasComponet;
  let fixture: ComponentFixture<RecetasFavoritasComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetasFavoritasComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetasFavoritasComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
