import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrawerSignosVitalesComponent } from './drawer-signos-vitales.component';

describe('DrawerSignosVitalesComponent', () => {
  let component: DrawerSignosVitalesComponent;
  let fixture: ComponentFixture<DrawerSignosVitalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerSignosVitalesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerSignosVitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
