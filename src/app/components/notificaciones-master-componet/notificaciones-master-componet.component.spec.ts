import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotificacionesMasterComponetComponent } from './notificaciones-master-componet.component';

describe('NotificacionesMasterComponetComponent', () => {
  let component: NotificacionesMasterComponetComponent;
  let fixture: ComponentFixture<NotificacionesMasterComponetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesMasterComponetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionesMasterComponetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
