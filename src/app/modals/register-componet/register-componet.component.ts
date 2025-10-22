import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomStepperComponent, StepperStep } from '../../components/steper-costumer/custom-stepper.component';
import { Router } from '@angular/router';
import { AuthMockService, UsuarioRegistro } from '../../services/auth-mock.service';

export interface RegistroData {
  // Define aquí los datos que necesites pasar al dialog
}

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-registro-dialog',
  templateUrl: './register-componet.component.html',
  styleUrls: ['./register-componet.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CustomStepperComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSnackBarModule,
    IonicModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class RegistroDialogComponent implements OnInit, OnDestroy {
  // Formularios por pasos
  datosPersonalesForm!: FormGroup;
  verificacionEmailForm!: FormGroup;
  configuracionRecetaForm!: FormGroup;
  verificacionKYCForm!: FormGroup;
  finalizarForm!: FormGroup;

  private resizeListener?: () => void;

  // Configuración del Custom Stepper
  currentStep = 0;
  isLinear = true;

  // Propiedades para sub-pasos móviles
  mobileSubStep = 0;
  maxMobileSubSteps(): number {
    return this.currentStep === 0 || this.currentStep === 2 ? 2 : 0;
  }
  isMobile = false;

  // Definir los pasos del stepper
  steps: StepperStep[] = [
    { label: 'Crear cuenta', completed: false, active: true, disabled: false },
    { label: 'Verificación Email', completed: false, active: false, disabled: false },
    { label: 'Datos Profesionales', completed: false, active: false, disabled: false },
    { label: 'Verificación KYC', completed: false, active: false, disabled: false },
    { label: 'Finalizar', completed: false, active: false, disabled: false },
  ];

  // Estados y variables de control
  hidePassword = true;
  hideConfirmPassword = true;
  isSubmitting = false;
  isResendingEmail = false;

  // Catálogos
  estados = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
    'México', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León',
    'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
    'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas',
  ];

 especialidadesMedicas: string[] = [
  'Médico General',
  'Alergología',
  'Algología',
  'Anatomía Patológica',
  'Andrología',
  'Anestesiología',
  'Angiología',
  'Audiología, Otoneurología y Foniatría',
  'Bariatría',
  'Calidad de la Atención Clínica',
  'Cardiología',
  'Cirugía General',
  'Cirugía Oncológica',
  'Cirugía Pediátrica',
  'Cirugía Plástica',
  'Coloproctología',
  'Crecimiento y Desarrollo',
  'Dermatología',
  'Diabetología',
  'Endocrinología',
  'Endoscopia',
  'Epidemiología',
  'Gastroenterología',
  'Gastroenterología Pediátrica',
  'Genética Médica',
  'Geriatría',
  'Ginecología y Obstetricia',
  'Hematología',
  'Hematología y Oncopediatría',
  'Homeopatía',
  'Imagenología Diagnóstica y Terapéutica',
  'Infectología',
  'Inmunología',
  'Medicina Crítica',
  'Medicina de la Actividad Física y Deportiva',
  'Medicina de Rehabilitación',
  'Medicina de Urgencias',
  'Medicina del Trabajo y Ambiental',
  'Medicina Familiar',
  'Medicina Intensiva',
  'Medicina Interna',
  'Medicina Legal',
  'Medicina Nuclear e Imagenología Molecular',
  'Medicina Paliativa',
  'Medicina Preventiva',
  'Nefrología',
  'Neonatología',
  'Neumología',
  'Neumología y Cardiopediatría',
  'Neurocirugía',
  'Neurología',
  'Oftalmología',
  'Oncología',
  'Otorrinolaringología y Cirugía de Cabeza y Cuello',
  'Patología Clínica',
  'Pediatría',
  'Pediatría Dermatológica',
  'Proctología',
  'Psiquiatría',
  'Radio Oncología',
  'Reumatología',
  'Terapia Intensiva',
  'Traumatología y Ortopedia',
  'Urología',
];


  filteredEspecialidades!: Observable<string[]>;

  // Variables de verificación
  emailVerificationCode: string | null = null;
  selectedFileName: string | null = null;
  verificationCode: string = '';
  error: string | null = null;

  // Variables para KYC personalizado
  kycStatus: { success: boolean; message: string } | null = null;
  isProcessingKYC = false;

  // Propiedades para KYC con sub-pasos
  kycCurrentSubStep = 0;
  kycSubSteps = [
    { id: 0, title: 'Selección de verificación', completed: false },
    { id: 1, title: 'Documento de identidad', completed: false },
    { id: 2, title: 'Confirmación de documento', completed: false },
    { id: 3, title: 'Verificación facial', completed: false },
    { id: 4, title: 'Omitir verificación', completed: false },
    { id: 5, title: 'Confirmación final', completed: false },
  ];

  documentoINE: {
    file: File | null;
    preview: string | null;
    uploaded: boolean;
    processing: boolean;
  } = {
    file: null,
    preview: null,
    uploaded: false,
    processing: false,
  };

  verificacionFacial: {
    started: boolean;
    completed: boolean;
    processing: boolean;
    instructions: boolean;
  } = {
    started: false,
    completed: false,
    processing: false,
    instructions: false,
  };

  correoUsuarioRegistrado = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private authMock: AuthMockService,
    private router: Router,
    public dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistroData
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.setupMobileDetection();
    this.filteredEspecialidades = this.configuracionRecetaForm.get('especialidad_medica')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEspecialidades(value || '')),
    );
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  // Métodos de detección móvil
  private setupMobileDetection(): void {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    this.isMobile = mediaQuery.matches;

    let timeoutId: any;
    this.resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const previousMobile = this.isMobile;
        this.isMobile = mediaQuery.matches;
        if (previousMobile !== this.isMobile) {
          this.resetMobileSubSteps();
          this.cdr.detectChanges();
        }
      }, 150);
    };

    mediaQuery.addEventListener('change', this.resizeListener);
  }

  // Métodos de sub-pasos móviles
  getMobileSubStepTitle(): string {
    if (this.currentStep === 0) {
      const titles = ['Información básica', 'Contacto y acceso'];
      return titles[this.mobileSubStep] || '';
    } else if (this.currentStep === 2) {
      const titles = ['Estudios', 'Consultorio médico'];
      return titles[this.mobileSubStep] || '';
    }
    return '';
  }

  getMobileSubStepProgress(): string {
    if (this.currentStep === 0 || this.currentStep === 2) {
      return `${this.mobileSubStep + 1} de ${this.maxMobileSubSteps()}`;
    }
    return '';
  }

  nextMobileSubStep(): void {
    if (this.mobileSubStep < this.maxMobileSubSteps() - 1) {
      if (this.canProceedToNextMobileSubStep()) {
        this.mobileSubStep++;
        this.cdr.detectChanges();
      } else {
        this.markCurrentMobileSubStepAsTouched();
        this.showErrorMessage('Por favor, completa todos los campos requeridos.');
      }
    } else {
      this.nextStepCustom();
    }
  }

  previousMobileSubStep(): void {
    if (this.mobileSubStep > 0) {
      this.mobileSubStep--;
      this.cdr.detectChanges();
    } else {
      this.previousStepCustom();
    }
  }

  canProceedToNextMobileSubStep(): boolean {
    if (!this.isMobile) return true;
    if (this.currentStep === 0) {
      switch (this.mobileSubStep) {
        case 0:
          return this.isSubStepFieldsValid(this.datosPersonalesForm, ['nombre', 'primerApellido', 'segundoApellido', 'fechaNacimiento', 'estado']);
        case 1:
          return (
            this.isSubStepFieldsValid(this.datosPersonalesForm, ['celular', 'correo', 'contrasena', 'confirmarContrasena', 'terminosCondiciones']) &&
            !this.datosPersonalesForm.hasError('passwordMismatch')
          );
        default:
          return true;
      }
    } else if (this.currentStep === 2) {
      switch (this.mobileSubStep) {
        case 0:
          return this.isSubStepFieldsValid(this.configuracionRecetaForm, ['cedula_profesional', 'especialidad_medica', 'institucion']);
        case 1:
          return this.isSubStepFieldsValid(this.configuracionRecetaForm, ['consultorio', 'direccion', 'telconsultorio']);
        default:
          return true;
      }
    }
    return true;
  }

  private isSubStepFieldsValid(form: FormGroup, fieldNames: string[]): boolean {
    return fieldNames.every(fieldName => {
      const control = form.get(fieldName);
      return control && control.valid;
    });
  }

  markCurrentMobileSubStepAsTouched(): void {
    let fieldsToMark: string[] = [];
    if (this.currentStep === 0) {
      switch (this.mobileSubStep) {
        case 0:
          fieldsToMark = ['nombre', 'primerApellido', 'segundoApellido', 'fechaNacimiento', 'estado'];
          break;
        case 1:
          fieldsToMark = ['celular', 'correo', 'contrasena', 'confirmarContrasena', 'terminosCondiciones'];
          break;
      }
      fieldsToMark.forEach(field => {
        const control = this.datosPersonalesForm.get(field);
        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
    } else if (this.currentStep === 2) {
      switch (this.mobileSubStep) {
        case 0:
          fieldsToMark = ['cedula_profesional', 'especialidad_medica', 'institucion'];
          break;
        case 1:
          fieldsToMark = ['consultorio', 'direccion', 'telconsultorio'];
          break;
      }
      fieldsToMark.forEach(field => {
        const control = this.configuracionRecetaForm.get(field);
        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
    }
    this.cdr.detectChanges();
  }

  resetMobileSubSteps(): void {
    this.mobileSubStep = 0;
    this.cdr.detectChanges();
  }

  shouldShowMobileSubStepFields(subStep: number): boolean {
    if (!this.isMobile) return false;
    if (this.currentStep !== 0 && this.currentStep !== 2) return false;
    return this.mobileSubStep === subStep;
  }

  shouldShowMobileHeader(): boolean {
    return this.isMobile && (this.currentStep === 0 || this.currentStep === 2);
  }

  shouldShowMainStepper(): boolean {
    return !this.isMobile || (this.currentStep !== 0 && this.currentStep !== 2);
  }

  shouldShowNavigationButtons(): boolean {
    if (this.currentStep === 3) {
      // En el Paso 3 (KYC), mostrar botones en todos los sub-pasos
      return true;
    }
    if (this.currentStep === 4) {
      // En el Paso 4, solo mostrar el botón "Finalizar"
      return true;
    }
    // Mostrar botones en los pasos 0, 1, 2
    return [0, 1, 2].includes(this.currentStep);
  }

  getMainContainerClass(): string {
    return this.isMobile ? 'mobile-container step-content' : 'desktop-container step-content';
  }

  getFormContainerClass(): string {
    return this.isMobile ? 'mobile-form step-form' : 'desktop-form step-form';
  }

  getMobileStepButtonText(): string {
    if (!this.isMobile) {
      if (this.currentStep === 3 && this.kycCurrentSubStep === 5) {
        return 'Finalizar';
      }
      if (this.currentStep === 4) {
        return 'Finalizar';
      }
      return 'Siguiente';
    }
    if (this.currentStep === 0) {
      return this.mobileSubStep < this.maxMobileSubSteps() - 1 ? 'Continuar' : 'Crear cuenta';
    } else if (this.currentStep === 2) {
      return this.mobileSubStep < this.maxMobileSubSteps() - 1 ? 'Continuar' : 'Siguiente';
    } else if (this.currentStep === 3 && this.kycCurrentSubStep === 5) {
      return 'Finalizar';
    } else if (this.currentStep === 4) {
      return 'Finalizar';
    }
    return 'Siguiente';
  }

  getMobileBackButtonText(): string {
    if (!this.isMobile) {
      return this.currentStep > 0 && this.currentStep !== 4 ? 'Atrás' : 'Cancelar';
    }
    if ((this.currentStep === 0 || this.currentStep === 2) && this.mobileSubStep > 0) {
      return 'Atrás';
    }
    return this.currentStep > 0 && this.currentStep !== 4 ? 'Atrás' : 'Cancelar';
  }

  // Eventos del custom stepper
  onStepChange(stepIndex: number): void {
    console.log('Paso cambiado a:', stepIndex);
    this.currentStep = stepIndex;
    this.resetMobileSubSteps();
    this.updateStepsState();
  }

  onStepClick(stepIndex: number): void {
    console.log('Clic en paso:', stepIndex);
    if (this.canNavigateToStep(stepIndex)) {
      this.currentStep = stepIndex;
      this.resetMobileSubSteps();
      this.updateStepsState();
    }
  }

  canNavigateToStep(stepIndex: number): boolean {
    if (!this.isLinear) return true;
    if (stepIndex <= this.currentStep) return true;
    return this.steps[stepIndex - 1]?.completed || false;
  }

  updateStepsState(): void {
    this.steps.forEach((step, index) => {
      step.active = index === this.currentStep;
    });
  }

  // Métodos de navegación
  nextStepCustom(): void {
    console.log('nextStepCustom ejecutado, currentStep:', this.currentStep, 'mobileSubStep:', this.mobileSubStep);

    switch (this.currentStep) {
      case 0:
        // Manejar sub-pasos móviles
        if (this.isMobile && this.mobileSubStep < this.maxMobileSubSteps() - 1) {
          this.nextMobileSubStep();
          return;
        }
        // Registrar usuario
        this.registrarYEnviarCodigo();
        break;

      case 1:
        // Verificar código de email
        this.verificarCodigoEmailReal();
        break;

      case 2:
        // Manejar sub-pasos móviles
        if (this.isMobile && this.mobileSubStep < this.maxMobileSubSteps() - 1) {
          this.nextMobileSubStep();
          return;
        }
        // Guardar datos profesionales
        this.guardarDatosProfesionalesReal();
        break;

      case 3:
        // KYC con sub-pasos
        console.log('Paso 3 - KYC con sub-pasos, subStep:', this.kycCurrentSubStep);
        if (this.kycCurrentSubStep < 5) {
          if (this.puedeAvanzarSubPaso()) {
            this.kycCurrentSubStep++;
            console.log('Avanzando a sub-paso:', this.kycCurrentSubStep);
            this.cdr.detectChanges();
          } else {
            console.log('No se puede avanzar en el sub-paso:', this.kycCurrentSubStep);
            this.showErrorMessage('Por favor, completa el sub-paso actual.');
          }
        } else {
          // Completar KYC y avanzar
          this.completarVerificacionKYCReal();
        }
        break;

      case 4:
        // Finalizar registro
        console.log('Último paso, finalizando registro');
        this.finalizarRegistroReal();
        break;

      default:
        console.log('Paso no válido:', this.currentStep);
    }
  }

  previousStepCustom(): void {
    if (this.isMobile && this.currentStep === 0 && this.mobileSubStep > 0) {
      this.previousMobileSubStep();
      return;
    }
    if (this.currentStep > 0) {
      this.currentStep--;
      this.resetMobileSubSteps();
      this.updateStepsState();
      console.log('Paso anterior, currentStep:', this.currentStep);
    } else {
      this.onCancel();
    }
  }

  completeCurrentStepAndAdvance(): void {
    this.steps[this.currentStep].completed = true;
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.resetMobileSubSteps();
      this.updateStepsState();
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Inicialización de formularios
  initializeForms() {
    this.datosPersonalesForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      primerApellido: ['', [Validators.required, Validators.minLength(2)]],
      segundoApellido: ['', [Validators.required, Validators.minLength(2)]],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      estado: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', Validators.required],
      terminosCondiciones: [false, Validators.requiredTrue],
    }, { validators: this.passwordMatchValidator });

    this.verificacionEmailForm = this.fb.group({
      codigoVerificacionEmail: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]{6}$/),
      ]],
    });

    this.configuracionRecetaForm = this.fb.group({
      cedula_profesional: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      especialidad_medica: ['', Validators.required],
      institucion: ['', Validators.required],
      consultorio: ['', Validators.required],
      direccion: ['', Validators.required],
      telconsultorio: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

    this.verificacionKYCForm = this.fb.group({
      documentoIdentidad: [''],
      numeroVerificacion: [''],
    });

    this.finalizarForm = this.fb.group({
      fotoPerfil: [''],
      notificaciones: [true],
    });
  }

  // Validadores personalizados
  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('contrasena');
    const confirmPassword = control.get('confirmarContrasena');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  // Métodos de verificación email
  enviarCodigoVerificacionEmail() {
    const email = this.datosPersonalesForm.get('correo')?.value;
    if (email && this.datosPersonalesForm.valid) {
      console.log('Enviando código de verificación por email a:', email);
      this.emailVerificationCode = this.generateVerificationCode();
      console.log('Código email generado:', this.emailVerificationCode);
    } else {
      console.log('Formulario no válido o correo no ingresado');
      this.showErrorMessage('Formulario no válido o correo no ingresado.');
    }
  }

  reenviarCodigoEmail() {
    this.reenviarCodigoEmailReal();
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  validarCodigoEmail(): boolean {
    const enteredCode = this.verificacionEmailForm.get('codigoVerificacionEmail')?.value;
    if (enteredCode === this.emailVerificationCode || enteredCode === '000000') {
      return true;
    }
    this.verificacionEmailForm.get('codigoVerificacionEmail')?.setErrors({ invalidCode: true });
    return false;
  }

  // Métodos KYC
  procesarKYCPersonalizado(): void {
    console.log('Procesando KYC paso:', this.kycCurrentSubStep);
    switch (this.kycCurrentSubStep) {
      case 0:
        break;
      case 1:
        if (!this.documentoINE.uploaded) {
          this.simularCargaDocumento();
        }
        this.avanzarSubPasoKYC();
        break;
      case 2:
        this.avanzarSubPasoKYC();
        break;
      case 3:
        this.procesarVerificacionFacial();
        break;
      case 4:
        this.confirmarOmitirVerificacion();
        break;
      case 5:
        this.completarKYCFinal();
        break;
    }
  }

  procesarVerificacionFacial(): void {
    console.log('Procesando verificación facial...');
    console.log('Mostrando instrucciones de verificación facial');
  }

  completarKYCFinal(): void {
    console.log('Completando KYC final...');
    this.kycSubSteps[this.kycCurrentSubStep].completed = true;
    this.kycStatus = {
      success: true,
      message: 'Verificación de identidad completada exitosamente',
    };
    setTimeout(() => {
      this.completeCurrentStepAndAdvance();
    }, 1500);
  }

  confirmarOmitirVerificacion(): void {
    console.log('Confirmando omitir verificación...');
    this.kycStatus = {
      success: false,
      message: 'Verificación de identidad omitida',
    };
    this.kycCurrentSubStep = 5;
  }

  irDirectoAConfirmacionFinal(): void {
    console.log('Iniciando verificación facial y yendo directo al paso 5...');
    this.verificacionFacial.completed = true;
    this.verificacionFacial.started = true;
    this.kycStatus = {
      success: true,
      message: 'Verificación facial completada exitosamente',
    };
    this.kycCurrentSubStep = 5;
    this.kycSubSteps[3].completed = true;
  }

  omitirPasoKYC(): void {
    console.log('Yendo al paso omitir KYC...');
    this.kycCurrentSubStep = 4;
    this.kycStatus = {
      success: false,
      message: '¿Estás seguro de omitir la verificación de identidad?',
    };
  }

  irASubPasoKYC(subStep: number): void {
    console.log('Navegando a sub-paso KYC:', subStep);
    this.kycCurrentSubStep = subStep;
    this.kycStatus = null;
  }

  avanzarSubPasoKYC(): void {
    if (this.kycCurrentSubStep < 5) {
      this.kycSubSteps[this.kycCurrentSubStep].completed = true;
      this.kycCurrentSubStep++;
      console.log('Avanzando a sub-paso:', this.kycCurrentSubStep);
      this.cdr.detectChanges();
    }
  }

  retrocederSubPasoKYC(): void {
    if (this.kycCurrentSubStep > 0) {
      const anteriorSubPaso = this.kycCurrentSubStep - 1;
      console.log('Retrocediendo de sub-paso', this.kycCurrentSubStep, 'a', anteriorSubPaso);
      this.kycCurrentSubStep = anteriorSubPaso;
      this.cdr.detectChanges();
    }
  }

  iniciarCargaINE(): void {
    console.log('Iniciando carga de INE - subir archivo');
    this.irASubPasoKYC(1);
  }

  simularCargaDocumento(): void {
    this.documentoINE.uploaded = true;
    this.documentoINE.file = {
      name: 'documento_simulado.jpg',
      size: 204800,
      type: 'image/jpeg',
    } as File;
    this.kycStatus = {
      success: true,
      message: 'Documento cargado correctamente',
    };
    console.log('Documento simulado cargado');
  }

  iniciarCapturaFoto(): void {
    console.log('Iniciando captura de foto con cámara');
    this.documentoINE.processing = true;
    setTimeout(() => {
      const fotoSimulada = this.simularFotoCapturada();
      this.procesarFotoCapturada(fotoSimulada);
    }, 2000);
  }

  procesarFotoCapturada(fotoData: any): void {
    this.documentoINE.processing = false;
    this.documentoINE.uploaded = true;
    this.documentoINE.preview = fotoData.dataUrl;
    this.kycStatus = {
      success: true,
      message: 'Foto capturada correctamente',
    };
    this.verificacionKYCForm.patchValue({
      documentoIdentidad: 'foto_capturada.jpg',
    });
    setTimeout(() => {
      this.avanzarSubPasoKYC();
    }, 1000);
  }

  private simularFotoCapturada(): any {
    return {
      dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      fileName: 'foto_capturada.jpg',
      size: 12345,
    };
  }

  onINEFileSelected(event: any): void {
    const file = event.target?.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.kycStatus = {
        success: false,
        message: 'Solo se permiten archivos JPG, JPEG o PNG',
      };
      this.showErrorMessage('Solo se permiten archivos JPG, JPEG o PNG');
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.kycStatus = {
        success: false,
        message: 'El archivo es demasiado grande. Máximo 10MB',
      };
      this.showErrorMessage('El archivo es demasiado grande. Máximo 10MB');
      return;
    }
    this.documentoINE.processing = true;
    this.documentoINE.file = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.documentoINE.preview = e.target.result;
      this.documentoINE.processing = false;
      this.documentoINE.uploaded = true;
      this.kycStatus = {
        success: true,
        message: 'Documento cargado correctamente',
      };
      this.verificacionKYCForm.patchValue({
        documentoIdentidad: file.name,
      });
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  eliminarDocumentoINE(): void {
    this.documentoINE = {
      file: null,
      preview: null,
      uploaded: false,
      processing: false,
    };
    this.kycStatus = {
      success: true,
      message: 'Documento eliminado correctamente',
    };
    this.verificacionKYCForm.patchValue({ documentoIdentidad: '' });
    if (this.kycCurrentSubStep === 0) {
      setTimeout(() => {
        this.kycStatus = null;
        this.cdr.detectChanges();
      }, 2000);
    }
  }

  confirmarDocumentoINE(): void {
    if (!this.documentoINE.uploaded && this.documentoINE.file) {
      this.documentoINE.uploaded = true;
      this.kycStatus = {
        success: true,
        message: 'Documento procesado correctamente',
      };
    }
    this.avanzarSubPasoKYC();
  }

  iniciarVerificacionFacial(): void {
    console.log('Iniciando verificación facial');
    this.irASubPasoKYC(3);
    this.mostrarInstruccionesFaciales();
  }

  mostrarInstruccionesFaciales(): void {
    this.verificacionFacial.instructions = true;
    this.cdr.detectChanges();
  }

  comenzarCapturaFacial(): void {
    console.log('Comenzando captura facial...');
    this.verificacionFacial.started = true;
    this.verificacionFacial.processing = true;
    this.verificacionFacial.instructions = false;
    setTimeout(() => {
      this.verificacionFacial.processing = false;
      this.verificacionFacial.completed = true;
      this.kycStatus = {
        success: true,
        message: 'Verificación facial completada exitosamente',
      };
      setTimeout(() => {
        this.completarKYC();
      }, 2000);
    }, 3000);
    this.cdr.detectChanges();
  }

  reintentarVerificacionFacial(): void {
    this.verificacionFacial = {
      started: false,
      completed: false,
      processing: false,
      instructions: true,
    };
    this.kycStatus = null;
    this.cdr.detectChanges();
  }

  completarKYC(): void {
    console.log('Completando proceso KYC...');
    this.kycSubSteps[this.kycCurrentSubStep].completed = true;
    this.kycStatus = {
      success: true,
      message: 'Verificación de identidad completada exitosamente',
    };
    setTimeout(() => {
      this.completeCurrentStepAndAdvance();
    }, 1500);
    this.cdr.detectChanges();
  }

  isKYCCompleto(): boolean {
    return this.kycCurrentSubStep === 5 || this.verificacionFacial.completed;
  }

  getTituloSubPasoKYC(): string {
    const titles = [
      'Selecciona el tipo de verificación',
      'Carga tu documento de identidad',
      'Confirmación de documento cargado',
      'Verificación facial',
      'Omitir verificación',
      'Confirmación final',
    ];
    return titles[this.kycCurrentSubStep] || '';
  }

  puedeAvanzarSubPaso(): boolean {
    switch (this.kycCurrentSubStep) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return true;
      default:
        return true;
    }
  }

  getTextoBotonKYC(): string {
    switch (this.kycCurrentSubStep) {
      case 0:
        return 'Seleccionar';
      case 1:
        return 'Subir documento';
      case 2:
        return 'Continuar';
      case 3:
        if (!this.verificacionFacial.started && !this.verificacionFacial.instructions) {
          return 'Comenzar verificación';
        }
        if (this.verificacionFacial.instructions && !this.verificacionFacial.started) {
          return 'Iniciar captura';
        }
        if (this.verificacionFacial.processing) {
          return 'Procesando...';
        }
        if (this.verificacionFacial.completed) {
          return 'Continuar';
        }
        return 'Continuar';
      case 4:
        return 'Sí, omitir';
      case 5:
        return 'Finalizar';
      default:
        return 'Continuar';
    }
  }

  deberaMostrarOmitir(): boolean {
    return this.kycCurrentSubStep !== 4 && this.kycCurrentSubStep !== 5;
  }

  deberaMostrarReintentar(): boolean {
    return this.kycCurrentSubStep === 4;
  }

  reintentarVerificacion(): void {
    console.log('Regresando a verificación facial...');
    this.verificacionFacial = {
      started: false,
      completed: false,
      processing: false,
      instructions: true,
    };
    this.kycCurrentSubStep = 3;
    this.kycStatus = null;
    this.cdr.detectChanges();
  }

  resetearKYC(): void {
    this.kycCurrentSubStep = 0;
    this.documentoINE = {
      file: null,
      preview: null,
      uploaded: false,
      processing: false,
    };
    this.verificacionFacial = {
      started: false,
      completed: false,
      processing: false,
      instructions: false,
    };
    this.kycSubSteps.forEach(step => (step.completed = false));
    this.kycStatus = null;
    this.isProcessingKYC = false;
    this.cdr.detectChanges();
  }

  // Métodos de finalización
  finalizarRegistro() {
    if (this.finalizarForm.invalid) {
      this.markFormGroupTouched(this.finalizarForm);
      this.showErrorMessage('Por favor, completa la configuración final.');
      return;
    }

    // Llama al método real que integra el servicio
    this.finalizarRegistroReal();
  }

  onCancel() {
    const confirmClose = confirm('¿Estás seguro de que quieres cancelar el registro? Se perderán todos los datos ingresados.');
    if (confirmClose) {
      this.dialogRef.close();
    }
  }

  // Métodos de utilidad
  onFileSelected(event: any) {
    const file = event.target?.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.showErrorMessage('Solo se permiten archivos de imagen (JPG, PNG, GIF)');
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.showErrorMessage('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }
      console.log('Archivo seleccionado:', file);
      this.selectedFileName = file.name;
      this.finalizarForm.patchValue({ fotoPerfil: file.name });
      this.cdr.detectChanges();
    }
  }

  private _filterEspecialidades(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.especialidadesMedicas.filter(option => option.toLowerCase().includes(filterValue));
  }

  onCodeInput(event: any): void {
    console.log('onCodeInput ejecutado');
    const input = event.target as HTMLInputElement;
    this.verificationCode = input.value.replace(/[^0-9]/g, '').slice(0, 6);
    this.verificacionEmailForm.get('codigoVerificacionEmail')?.setValue(this.verificationCode);
    input.value = this.verificationCode;
    console.log('Código actual:', this.verificationCode);
    if (this.verificationCode === '000000' && this.verificationCode.length === 6) {
      console.log('Código 000000 detectado, validando automáticamente');
      this.nextStepCustom();
    }
  }

  getPasswordErrors(): string | null {
    const control = this.datosPersonalesForm.get('contrasena');
    if (control?.hasError('required')) return 'La contraseña es requerida';
    if (control?.hasError('minlength')) return 'Mínimo 8 caracteres';
    return null;
  }

  getConfirmPasswordErrors(): string | null {
    const control = this.datosPersonalesForm.get('confirmarContrasena');
    if (control?.hasError('required')) return 'Confirma tu contraseña';
    if (control?.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';
    return null;
  }

  resetForms() {
    this.datosPersonalesForm.reset();
    this.verificacionEmailForm.reset();
    this.configuracionRecetaForm.reset();
    this.verificacionKYCForm.reset();
    this.finalizarForm.reset();
    this.currentStep = 0;
    this.emailVerificationCode = null;
    this.selectedFileName = null;
    this.verificationCode = '';
    this.error = null;
    this.kycStatus = null;
    this.isProcessingKYC = false;
    this.resetearKYC();
    this.steps.forEach((step, index) => {
      step.completed = false;
      step.active = index === 0;
    });
    this.cdr.detectChanges();
  }

  canProceedToNext(): boolean {
    switch (this.currentStep) {
      case 0:
        return this.datosPersonalesForm.valid;
      case 1:
        return this.verificacionEmailForm.valid && this.validarCodigoEmail();
      case 2:
        return this.configuracionRecetaForm.valid;
      case 3:
        return this.isKYCCompleto();
      case 4:
        return this.finalizarForm.valid;
      default:
        return false;
    }
  }

  getCurrentStepTitle(): string {
    const titles = [
      'Datos Personales',
      'Verificación por Email',
      'Información Profesional',
      'Verificación de Identidad',
      'Configuración Final',
    ];
    return titles[this.currentStep] || 'Paso';
  }

  // Métodos legacy
  nextStep(stepper?: any) {
    this.nextStepCustom();
  }

  previousStep(stepper?: any) {
    this.previousStepCustom();
  }

  // Métodos para botones dinámicos
  getLeftButtonText(): string {
    switch (this.kycCurrentSubStep) {
      case 4:
        return 'Reintentar';
      case 5:
        return 'Atrás';
      default:
        return 'Cancelar';
    }
  }

  getRightButtonText(): string {
    switch (this.kycCurrentSubStep) {
      case 4:
        return 'Omitir';
      case 5:
        return 'Finalizar';
      default:
        return this.getTextoBotonKYC();
    }
  }

  onLeftButtonClick(): void {
    switch (this.kycCurrentSubStep) {
      case 4:
        this.reintentarVerificacion();
        break;
      case 5:
        this.retrocederSubPasoKYC();
        break;
      default:
        this.onCancel();
    }
  }

  onRightButtonClick(): void {
    switch (this.kycCurrentSubStep) {
      case 4:
        this.confirmarOmitirVerificacion();
        break;
      case 5:
        this.completarKYCFinal();
        break;
      default:
        this.nextStepCustom();
    }
  }

  getDynamicButtonText(): string {
    switch (this.kycCurrentSubStep) {
      case 3:
        return 'Reintentar';
      case 4:
        return 'Atrás';
      case 5:
        return 'Atrás';
      default:
        return 'Cancelar';
    }
  }

  onDynamicButtonClick(): void {
    switch (this.kycCurrentSubStep) {
      case 3:
        this.reintentarVerificacionFacial();
        break;
      case 4:
        this.kycCurrentSubStep = 2;
        break;
      case 5:
        this.retrocederSubPasoKYC();
        break;
      default:
        this.onCancel();
    }
  }

  shouldShowReintentarStyle(): boolean {
    return this.kycCurrentSubStep === 4;
  }

  getDynamicButtonClass(): string {
    switch (this.kycCurrentSubStep) {
      case 4:
        return 'reintentar-button';
      default:
        return 'cancel-button';
    }
  }

  getTotalProgress(): number {
    if (!this.isMobile) {
      // Progreso en escritorio: basado solo en el paso actual
      return Math.round(((this.currentStep + 1) / this.steps.length) * 100);
    }

    // Progreso en móvil
    if (this.currentStep === 0 || this.currentStep === 2) {
      // Para pasos con sub-pasos (0 y 2), calcular progreso considerando sub-pasos
      const maxSubSteps = this.maxMobileSubSteps();
      if (maxSubSteps === 0) {
        // Evitar división por cero
        return Math.round((this.currentStep / this.steps.length) * 100);
      }
      const subStepProgress = (this.mobileSubStep + 1) / maxSubSteps;
      // Cada paso contribuye 1/length al progreso total, y los sub-pasos dividen esa contribución
      const stepProgress = (this.currentStep + subStepProgress) / this.steps.length;
      return Math.round(stepProgress * 100);
    }

    // Para pasos sin sub-pasos (1, 3, 4)
    return Math.round(((this.currentStep + 1) / this.steps.length) * 100);
  }

  get resumenDatos() {
    return {
      cuenta: {
        nombre: this.datosPersonalesForm.value.nombre,
        primerApellido: this.datosPersonalesForm.value.primerApellido,
        segundoApellido: this.datosPersonalesForm.value.segundoApellido,
        fechaNacimiento: this.datosPersonalesForm.value.fechaNacimiento,
        celular: this.datosPersonalesForm.value.celular,
        correo: this.datosPersonalesForm.value.correo,
      },
      profesionales: {
        cedula: this.configuracionRecetaForm.value.cedula_profesional,
        titulo: this.configuracionRecetaForm.value.especialidad_medica,
        institucion: this.configuracionRecetaForm.value.institucion,
      },
      consultorio: {
        nombre: this.configuracionRecetaForm.value.consultorio,
        direccion: this.configuracionRecetaForm.value.direccion,
        telefono: this.configuracionRecetaForm.value.telconsultorio,
      },
    };
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  /**
   * 📝 PASO 0 → PASO 1: Registrar usuario y enviar código
   */
  registrarYEnviarCodigo(): void {
    if (this.datosPersonalesForm.invalid) {
      this.markFormGroupTouched(this.datosPersonalesForm);  // Marca como tocados para mostrar errores
      this.showErrorMessage('Por favor, completa todos los campos requeridos.');
      return;
    }

    this.isSubmitting = true;

    // Preparar datos del usuario desde el formulario (como en Claude, pero ajustado a tus campos)
    const datosRegistro: UsuarioRegistro = {
      nombre: this.datosPersonalesForm.value.nombre,
      segundoNombre: this.datosPersonalesForm.value.nombre,
      primerApellido: this.datosPersonalesForm.value.primerApellido,
      segundoApellido: this.datosPersonalesForm.value.segundoApellido,
      fechaNacimiento: this.datosPersonalesForm.value.fechaNacimiento,
      estado: this.datosPersonalesForm.value.estado,
      celular: this.datosPersonalesForm.value.celular,
      correo: this.datosPersonalesForm.value.correo,
      contrasena: this.datosPersonalesForm.value.contrasena,
      cedula_profesional: '',  // Vacío por ahora
      especialidad_medica: '',
      institucion: '',
      consultorio: '',
      direccion: '',
      telconsultorio: ''
    };

    console.log('📤 Registrando usuario:', datosRegistro.correo);

    // Llamar al servicio de registro
    this.authMock.registrarUsuario(datosRegistro).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.success) {
          // Guardar correo para los siguientes pasos
          this.correoUsuarioRegistrado = datosRegistro.correo;

          // Obtener código de verificación del servicio (para simular)
          this.emailVerificationCode = this.authMock.getCodigoVerificacion(datosRegistro.correo) || null;

          // Mostrar código en consola (solo desarrollo)
          console.log('📧 Código de verificación enviado:', this.emailVerificationCode);

          // Avanzar al paso de verificación de email
          this.completeCurrentStepAndAdvance();

          this.snackBar.open(
            'Código de verificación enviado a tu correo',
            'Cerrar',
            { duration: 3000 }
          );
        } else {
          this.showErrorMessage(response.mensaje);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Error en registro:', error);
        this.showErrorMessage('Error al registrar usuario. Intenta de nuevo.');
      }
    });
  }

  /**
   * 📧 PASO 1: Verificar código de email
   */
verificarCodigoEmailReal(): void {
  if (this.verificacionEmailForm.invalid) {
    this.markFormGroupTouched(this.verificacionEmailForm);
    this.showErrorMessage('Por favor, ingresa el código de verificación.');
    return;
  }

  this.isSubmitting = true;
  const codigo = this.verificacionEmailForm.value.codigoVerificacionEmail;

  console.log('🔍 Verificando código:', codigo);

  // Bypass para desarrollo: si es '000000', asumir éxito sin llamar al servicio
  if (codigo === '000000') {
    console.log('✅ Bypass con código de prueba 000000');
    this.isSubmitting = false;
    this.completeCurrentStepAndAdvance();
    this.snackBar.open(
      'Email verificado (bypass de desarrollo)',
      'Cerrar',
      { duration: 2000 }
    );
    return;  // Salir sin llamar al servicio
  }

  // Lógica normal con el servicio
  this.authMock.verificarCodigoEmail(this.correoUsuarioRegistrado, codigo).subscribe({
    next: (response) => {
      this.isSubmitting = false;

      if (response.success) {
        console.log('✅ Código verificado correctamente');
        // Avanzar al siguiente paso
        this.completeCurrentStepAndAdvance();

        this.snackBar.open(
          'Email verificado exitosamente',
          'Cerrar',
          { duration: 2000 }
        );
      } else {
        // Código incorrecto
        this.verificacionEmailForm.get('codigoVerificacionEmail')?.setErrors({
          invalidCode: true
        });
        this.showErrorMessage(response.mensaje);
      }
    },
    error: (error) => {
      this.isSubmitting = false;
      console.error('❌ Error al verificar código:', error);
      this.showErrorMessage('Error al verificar código. Intenta de nuevo.');
    }
  });
}

  /**
   * 🔄 PASO 1: Reenviar código de email
   */
  reenviarCodigoEmailReal(): void {
    this.isResendingEmail = true;

    this.authMock.reenviarCodigoEmail(this.correoUsuarioRegistrado).subscribe({
      next: (response) => {
        this.isResendingEmail = false;

        if (response.success) {
          // Actualizar código en la variable local
          this.emailVerificationCode = this.authMock.getCodigoVerificacion(this.correoUsuarioRegistrado) || null;

          // Mostrar en consola (solo desarrollo)
          console.log('📧 Nuevo código de verificación:', this.emailVerificationCode);

          this.snackBar.open(
            'Código reenviado exitosamente',
            'Cerrar',
            { duration: 3000 }
          );
        } else {
          this.showErrorMessage(response.mensaje);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isResendingEmail = false;
        console.error('❌ Error al reenviar código:', error);
        this.showErrorMessage('Error al reenviar código.');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * 💼 PASO 2 → PASO 3: Guardar datos profesionales
   */
  guardarDatosProfesionalesReal(): void {
    if (this.configuracionRecetaForm.invalid) {
      this.markFormGroupTouched(this.configuracionRecetaForm);
      this.showErrorMessage('Por favor, completa todos los datos profesionales.');
      return;
    }

    this.isSubmitting = true;

    const datosProfesionales = {
      cedula_profesional: this.configuracionRecetaForm.value.cedula_profesional,
      especialidad_medica: this.configuracionRecetaForm.value.especialidad_medica,
      institucion: this.configuracionRecetaForm.value.institucion,
      consultorio: this.configuracionRecetaForm.value.consultorio,
      direccion: this.configuracionRecetaForm.value.direccion,
      telconsultorio: this.configuracionRecetaForm.value.telconsultorio
    };

    console.log('💼 Guardando datos profesionales');

    this.authMock.actualizarDatosProfesionales(
      this.correoUsuarioRegistrado,
      datosProfesionales
    ).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.success) {
          console.log('✅ Datos profesionales guardados');
          // Avanzar al paso de KYC
          this.completeCurrentStepAndAdvance();

          this.snackBar.open(
            'Datos profesionales guardados',
            'Cerrar',
            { duration: 2000 }
          );
        } else {
          this.showErrorMessage(response.mensaje);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Error al guardar datos profesionales:', error);
        this.showErrorMessage('Error al guardar datos profesionales.');
      }
    });
  }

  /**
   * 🔐 PASO 3 → PASO 4: Completar verificación KYC
   */
  completarVerificacionKYCReal(): void {
    this.isSubmitting = true;

    const documentoSubido = this.documentoINE.uploaded;  // Usa tus propiedades de KYC
    const facialCompletado = this.verificacionFacial.completed;

    console.log('🔐 Completando KYC:', { documentoSubido, facialCompletado });

    this.authMock.completarVerificacionKYC(
      this.correoUsuarioRegistrado,
      documentoSubido,
      facialCompletado
    ).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.success) {
          console.log('✅ Verificación KYC completada');
          // Preparar resumen de datos
          this.prepararResumenDatosReal();
          // Avanzar al paso final
          this.completeCurrentStepAndAdvance();

          this.snackBar.open(
            'Verificación de identidad completada',
            'Cerrar',
            { duration: 2000 }
          );
        } else {
          this.showErrorMessage(response.mensaje);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Error en verificación KYC:', error);
        this.showErrorMessage('Error en verificación KYC.');
      }
    });
  }

  /**
   * 📊 Preparar resumen de datos para el paso final
   */
  prepararResumenDatosReal(): void {
    const usuarioCompleto = this.authMock.getUsuarioRegistrado(this.correoUsuarioRegistrado);

    if (usuarioCompleto) {
      console.log('📊 Preparando resumen de datos:', usuarioCompleto);
      // Actualiza tu propiedad resumenDatos si es necesario (ya la tienes)
    } else {
      console.warn('⚠️ No se encontró usuario para resumen');
    }
  }

  /**
   * 🎉 PASO 4: Finalizar registro y auto-login
   */
  finalizarRegistroReal(): void {
    this.isSubmitting = true;

    console.log('🎉 Finalizando registro...');

    this.authMock.finalizarRegistro(this.correoUsuarioRegistrado).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.success) {
          console.log('✅ Registro completado:', response.usuario);

          // Marcar paso como completado
          this.steps[this.currentStep].completed = true;

          // Mostrar mensaje de éxito
          this.snackBar.open(
            `¡Bienvenido Dr. ${response.usuario.nombreCompleto}!`,
            'Cerrar',
            {
              duration: 3000,
              panelClass: ['success-snackbar']
            }
          );

          // Cerrar el modal con éxito y datos del usuario (esto hace que el login lo detecte y navegue al dashboard)
          setTimeout(() => {
            this.dialogRef.close({
              success: true,
              usuario: response.usuario
            });
          }, 1000);
        } else {
          this.showErrorMessage('Error al finalizar el registro. Por favor, intenta de nuevo.');
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Error al finalizar registro:', error);
        this.showErrorMessage('Error al finalizar registro.');
      }
    });
  }
}