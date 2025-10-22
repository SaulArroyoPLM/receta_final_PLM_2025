import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorNameComponent } from './doctor-name.component';

describe('DoctorNameComponent', () => {
  let component: DoctorNameComponent;
  let fixture: ComponentFixture<DoctorNameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DoctorNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
