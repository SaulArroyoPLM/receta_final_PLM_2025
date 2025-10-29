import { Component, OnInit, OnDestroy, AfterViewInit,ChangeDetectorRef, ViewChild, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { MenuMasterComponent } from '../../components/menu-master/menu-master.component';
import { MedicineSearchComponent } from '../../components/medicamento-buscador-component/medicine-search-component';
import { PatientSearchComponent } from '../../components/patient-search/patient-search-component';
import { RecetasFavoritasComponent } from '../../components/recetas-favoritas-componet/recetas-favoritas-componet';
import { RecomendacionesFavoritasComponent } from '../../components/recomendaciones-favoritas-componet/recomendaciones-favoritas-componet';
import { NotificationMasterComponent } from '../../components/notificaciones-master-componet/notificaciones-master-componet.component';
import { StarRatingComponent } from '../../components/star-rating-component/star-rating-component.component';
import { Notification } from '../../interfaces/notification.interface';
import { DoctorNameComponent } from '../../components/doctor-name/doctor-name.component';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NuevaRecetaComponent } from '../../modals/nueva-receta/nueva-receta.component';
import { FooterTabsComponent } from '../../components/footer-tabs/footer-tabs.component';
import { AuthMockService, UsuarioAutenticado } from '../../services/auth-mock.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterOutlet,
    MenuMasterComponent,
    MedicineSearchComponent,
    PatientSearchComponent,
    RecetasFavoritasComponent,
    RecomendacionesFavoritasComponent,
    NotificationMasterComponent,
    StarRatingComponent,
    MatIconModule,
    MatBadgeModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    FooterTabsComponent,
    RouterModule,
    DoctorNameComponent
  ],
  templateUrl: './homeComponent.html',
  styleUrls: ['./homeComponent.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('menuMaster') menuMaster!: MenuMasterComponent;
  usuarioActual: UsuarioAutenticado | null = null;
  nombreDoctor = '';
  ratingValue = 0;
  consultorios = ['Consultorio 1', 'Consultorio 2', 'Consultorio 3'];
  selectedConsultorio = this.consultorios[0];
  notificaciones: Notification[] = [];
  showMobileNotifications = false;
  sidebarOpen = true;
  sidebarCollapsed = false;
  isMobile = false;
  isTablet = false;
  isDesktopSmall = false;
  isDesktopMedium = false;
  isDesktopLarge = false;
  is4K = false;
  isUltraWide = false;
  adaptiveScale = 1;
  contentScale = 1;
  private isBrowser = false;
  private resizeTimeout: any;

constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private usuarioService: UsuarioService,
    private authMock: AuthMockService,
    private router: Router,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef // Corrección aquí, sin llaves
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.authMock.currentUser$.subscribe({
      next: (user: UsuarioAutenticado | null) => {
        this.usuarioActual = user;
        console.log('🔍 DEBUG - Usuario en Home:', this.usuarioActual);
      },
      error: (error: any) => {
        console.error('❌ Error al obtener usuario en Home:', error);
        this.usuarioActual = null;
      }
    });
    if (this.isBrowser) {
      this.initializeLayout();
      this.setupEventListeners();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.refreshLayout(), 100);
    }
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  private initializeLayout(): void {
    this.refreshLayout();
    this.loadNotifications();
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleOrientationChange);
  }

  private removeEventListeners(): void {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
  }

  private handleResize = (): void => {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.refreshLayout();
    }, 150);
  };

  private handleOrientationChange = (): void => {
    setTimeout(() => {
      this.refreshLayout();
    }, 300);
  };

  private refreshLayout = (): void => {
    const width = window.innerWidth;
    this.resetBreakpoints();
    if (width < 768) {
      this.isMobile = true;
    } else if (width >= 768 && width < 1024) {
      this.isTablet = true;
    } else if (width >= 1024 && width < 1200) {
      this.isDesktopSmall = true;
    } else if (width >= 1200 && width < 1440) {
      this.isDesktopMedium = true;
    } else if (width >= 1440 && width < 1920) {
      this.isDesktopLarge = true;
    } else if (width >= 1920 && width < 2560) {
      this.is4K = true;
    } else {
      this.isUltraWide = true;
    }
    this.updateAdaptiveScales(width);
    if (this.isDesktop && this.showMobileNotifications) {
      this.showMobileNotifications = false;
    }
    this.logBreakpointChange(width);
  };

  private resetBreakpoints(): void {
    this.isMobile = false;
    this.isTablet = false;
    this.isDesktopSmall = false;
    this.isDesktopMedium = false;
    this.isDesktopLarge = false;
    this.is4K = false;
    this.isUltraWide = false;
  }

  private updateAdaptiveScales(width: number): void {
    if (width < 768) {
      this.adaptiveScale = 0.85;
      this.contentScale = 0.9;
    } else if (width < 1024) {
      this.adaptiveScale = 0.9;
      this.contentScale = 0.95;
    } else if (width < 1440) {
      this.adaptiveScale = 1;
      this.contentScale = 1;
    } else if (width < 1920) {
      this.adaptiveScale = 1.05;
      this.contentScale = 1.02;
    } else {
      this.adaptiveScale = 1.1;
      this.contentScale = 1.05;
    }
  }

  get isDesktop(): boolean {
    return this.isDesktopSmall || this.isDesktopMedium || this.isDesktopLarge || this.is4K || this.isUltraWide;
  }

  get isMobileOrTablet(): boolean {
    return this.isMobile || this.isTablet;
  }

  get unreadNotifications(): Notification[] {
    return this.notificaciones.filter(n => n.unread || false);
  }

  shouldShowNotifications(): boolean {
    return this.isDesktopSmall || this.isDesktopMedium || this.isDesktopLarge || this.is4K || this.isUltraWide;
  }

  shouldShowSidebarInline(): boolean {
    return !this.isMobile;
  }

  shouldShowMobileHeader(): boolean {
    return this.isMobile || this.isTablet;
  }

  getSidebarWidth(): string {
    return this.sidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)';
  }

  getNotificationsWidth(): string {
    if (this.isDesktopSmall) return '250px';
    if (this.isDesktopMedium) return '280px';
    if (this.isDesktopLarge) return '300px';
    if (this.is4K || this.isUltraWide) return '300px';
    return '280px';
  }

  getNotificationsListHeight(): string {
    const notificationCount = this.notificaciones.length;
    if (notificationCount === 0) return '120px';
    const baseHeightPerNotification = 70;
    const dynamicHeight = notificationCount * baseHeightPerNotification;
    const maxHeight = 300;
    return `${Math.min(dynamicHeight, maxHeight)}px`;
  }

  getContainerStyle(): { [key: string]: any } {
    return {
      'overflow-x': 'hidden',
      'min-height': '100vh',
      '--adaptive-scale': this.adaptiveScale.toString(),
      '--content-scale': this.contentScale.toString()
    };
  }

  getMainColumnStyle(): { [key: string]: any } {
    return {
      'flex': '1 1 auto',
      'min-width': '0',
      'overflow': 'hidden'
    };
  }

  getTitleStyle(): { [key: string]: any } {
    const fontSize = this.isMobile ? '1.2rem' :
                    this.isTablet ? '1.3rem' :
                    this.isDesktopSmall ? '1.4rem' :
                    this.isDesktopMedium ? '1.5rem' : '1.6rem';
    return {
      'font-size': fontSize,
      'font-weight': '600',
      'transition': 'font-size 0.3s ease'
    };
  }

  get sidebarClasses(): { [key: string]: boolean } {
    return {
      'sidebar-expanded': this.sidebarOpen && !this.sidebarCollapsed,
      'sidebar-collapsed': this.sidebarCollapsed,
      'd-none': this.isMobile && !this.sidebarOpen,
      'd-md-block': !this.isMobile
    };
  }

  onConsultorioSeleccionado(nombre: string): void {
    this.selectedConsultorio = nombre;
    console.log('Consultorio seleccionado:', nombre);
  }
onSidebarToggle(event: { open: boolean; collapsed: boolean }): void {
    this.sidebarOpen = event.open;
    this.sidebarCollapsed = event.collapsed;
    console.log('Received Sidebar Toggle - Open:', this.sidebarOpen, 'Collapsed:', this.sidebarCollapsed);
    this.forceLayoutRefresh();
  }
  

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    if (this.isMobile) {
      this.sidebarOpen = !this.sidebarOpen;
      if (this.sidebarOpen) {
        this.showMobileNotifications = false;
      }
    }
    this.forceLayoutRefresh();
  }

  onMenuItemClick(): void {
    if (this.showMobileNotifications) {
      this.showMobileNotifications = false;
    }
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  onNuevaRecetaClick() {
    const dialogRef = this.dialog.open(NuevaRecetaComponent, {
      width: '1080px',
      height: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado, acción:', result);
      if (result === 'new-patient') {
        // lógica si se creó un nuevo paciente
      } else if (result === 'search-patient') {
        // lógica si se busca un paciente existente
      }
    });
  }

  toggleMobileNotifications(): void {
    this.showMobileNotifications = !this.showMobileNotifications;
    if (this.showMobileNotifications && this.isMobile && this.sidebarOpen) {
      this.sidebarOpen = false;
    }
  }

  closeMobileNotifications(): void {
    this.showMobileNotifications = false;
  }

  onNotificationAction(event: any): void {
    console.log('Acción de notificación:', event);
    switch (event.action) {
      case 'mark_read':
        this.markNotificationAsRead(event.notificationId);
        break;
      case 'delete':
        this.deleteNotification(event.notificationId);
        break;
      case 'navigate':
        this.router.navigate([event.route]);
        break;
      default:
        console.log('Acción no reconocida:', event);
    }
  }

  private markNotificationAsRead(id: number): void {
    const notification = this.notificaciones.find(n => n.id === id);
    if (notification) {
      notification.unread = false;
    }
  }

  private deleteNotification(id: number): void {
    this.notificaciones = this.notificaciones.filter(n => n.id !== id);
  }

  private loadNotifications(): void {
    this.notificaciones = [
      {
        id: 1,
        type: 'info',
        title: 'Verificación pendiente',
        message: 'Aún no puedes recetar exitosamente porque tu cédula aún no está verificada',
        icon: 'info',
        time: 'Hace 2 minutos',
        unread: true,
        link: '/verificacion',
        actions: [{ action: 'view', label: 'Verificar cédula', icon: 'visibility' }]
      },
      {
        id: 2,
        type: 'info',
        title: 'Verificación pendiente',
        message: 'Tu identidad aún no está verificada exitosamente para recetar',
        icon: 'info',
        time: 'Hace 2 minutos',
        unread: true,
        link: '/verificacion',
        actions: [{ action: 'view', label: 'Verificar identidad', icon: 'visibility' }]
      },
      {
        id: 3,
        type: 'success',
        title: 'Receta pendiente',
        message: 'Tienes una receta pendiente de completar',
        icon: 'assignment',
        time: 'Hace 5 minutos',
        link: '/verificacion',
        unread: true,
        actions: [{ action: 'view', label: 'Ir a receta', icon: 'visibility' }]
      }
    ];
  }

  onRatingSelected(data: { rating: number, comment: string }): void {
    this.ratingValue = data.rating;
    console.log('Rating seleccionado:', data);
  }

  onMenuRatingSelected(event: any): void {
    this.onRatingSelected(event);
  }

  trackByNotificationId(index: number, item: Notification): any {
    return item.id || index;
  }

  private logBreakpointChange(width: number): void {
    if (typeof console !== 'undefined' && console.log) {
      const breakpoint = this.getCurrentBreakpointName();
      console.log(`📱 Breakpoint: ${breakpoint} (${width}px) | Notificaciones: ${this.shouldShowNotifications()}`);
    }
  }

  private getCurrentBreakpointName(): string {
    if (this.isMobile) return 'Mobile';
    if (this.isTablet) return 'Tablet';
    if (this.isDesktopSmall) return 'Desktop Small';
    if (this.isDesktopMedium) return 'Desktop Medium';
    if (this.isDesktopLarge) return 'Desktop Large';
    if (this.is4K) return '4K';
    if (this.isUltraWide) return 'Ultra Wide';
    return 'Unknown';
  }

  getLayoutInfo(): { [key: string]: any } {
    return {
      breakpoint: this.getCurrentBreakpointName(),
      width: window.innerWidth,
      showNotifications: this.shouldShowNotifications(),
      sidebarWidth: this.getSidebarWidth(),
      notificationsWidth: this.getNotificationsWidth(),
      adaptiveScale: this.adaptiveScale,
      contentScale: this.contentScale
    };
  }

forceLayoutRefresh(): void {
    // Fuerza la detección de cambios para actualizar el layout
    this.cdr.detectChanges();
  }


getGridTemplateColumns(): string {
  // Mobile - sin sidebar
  if (this.isMobile || this.isTablet) {
    return '1fr';
  }
  
  // Desktop Small (1024-1199px) - sin notificaciones
  if (this.isDesktopSmall) {
    if (this.sidebarCollapsed) {
      return '80px 1fr'; // 80px sidebar colapsado, resto para main
    }
    return '280px 1fr'; // 280px sidebar expandido, resto para main
  }
  
  // Desktop Medium y superiores - con notificaciones
  if (this.sidebarCollapsed) {
    return '130px 1fr 300px'; // 10% colapsado, 70% main, 20% notificaciones
  }
  
  return '280px 1fr 300px'; // 20% sidebar, 60% main, 20% notificaciones
}

getGridTemplateAreas(): string {
  if (this.isMobile || this.isTablet) {
    return '"main"';
  }
  
  if (this.isDesktopSmall) {
    return '"sidebar main"';
  }
  
  return '"sidebar main notifications"';
}
}