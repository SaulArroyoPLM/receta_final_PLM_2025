import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteperCostumer } from './steper-costumer';

describe('SteperCostumer', () => {
  let component: SteperCostumer;
  let fixture: ComponentFixture<SteperCostumer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteperCostumer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteperCostumer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
