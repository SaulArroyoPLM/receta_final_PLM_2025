import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interfaces para los datos del usuario
export interface UsuarioRegistro {
  // Datos personales
  nombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: Date;
  estado: string;
  celular: string;
  correo: string;
  contrasena: string;
  
  // Datos profesionales
  cedula_profesional: string;
  especialidad_medica: string;
  institucion: string;
  consultorio: string;
  direccion: string;
  telconsultorio: string;
  
  // Metadata
  fechaRegistro?: Date;
  emailVerificado?: boolean;
  kycCompletado?: boolean;
}

export interface UsuarioAutenticado {
  id: string;
  nombreCompleto: string;
  nombre: string;
  segundoNombre?: string; // Agregar este campo
  primerApellido: string;
  segundoApellido: string;
  correo: string;
  especialidad: string;
  cedula: string;
  emailVerificado: boolean;
  kycCompletado: boolean;
  token: string;
  especialidad_medica?: string;
}

export interface LoginCredentials {
  correo: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthMockService {
  // BehaviorSubject para manejar el estado del usuario autenticado
  private currentUserSubject = new BehaviorSubject<UsuarioAutenticado | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Simulación de base de datos en memoria
  private usuariosRegistrados: Map<string, UsuarioRegistro> = new Map();
  
  // Códigos de verificación temporales (email -> código)
  private codigosVerificacion: Map<string, string> = new Map();

  constructor() {
    // Cargar usuario de localStorage si existe
    this.cargarUsuarioGuardado();
    
    // Agregar usuario de prueba para desarrollo
    this.agregarUsuarioPrueba();
  }

  /**
   * Agregar usuario de prueba para desarrollo
   */
  private agregarUsuarioPrueba(): void {
    const usuarioPrueba: UsuarioRegistro = {
      nombre: 'Ramiro',
      segundoNombre: 'Fernando',
      primerApellido: 'Ferrandez',
      segundoApellido: 'Ledezma',
      fechaNacimiento: new Date('1985-05-15'),
      estado: 'Ciudad de México',
      celular: '5512345678',
      correo: 'doctor@ejemplo.com',
      contrasena: 'Password123!',
      cedula_profesional: '12345678',
      especialidad_medica: 'Pediatría',
      institucion: 'UNAM',
      consultorio: 'Consultorio Médico Ejemplo',
      direccion: 'Av. Insurgentes Sur 123, Col. Roma',
      telconsultorio: '5587654321',
      fechaRegistro: new Date(),
      emailVerificado: true,
      kycCompletado: true
    };
    
    this.usuariosRegistrados.set(usuarioPrueba.correo.toLowerCase(), usuarioPrueba);
  }

  /**
   * Cargar usuario guardado desde localStorage
   */
  private cargarUsuarioGuardado(): void {
    const usuarioGuardado = localStorage.getItem('currentUser');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.currentUserSubject.next(usuario);
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * Guardar usuario en localStorage
   */
  private guardarUsuario(usuario: UsuarioAutenticado): void {
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  /**
   * PASO 1: Registrar nuevo usuario (Datos Personales)
   */
  registrarUsuario(datos: UsuarioRegistro): Observable<{ success: boolean; mensaje: string; userId?: string }> {
    return new Observable(observer => {
      // Simular delay de red
      setTimeout(() => {
        const correoLower = datos.correo.toLowerCase();
        
        // Validar si el usuario ya existe
        if (this.usuariosRegistrados.has(correoLower)) {
          observer.next({
            success: false,
            mensaje: 'Este correo electrónico ya está registrado'
          });
          observer.complete();
          return;
        }

        // Guardar usuario
        const nuevoUsuario: UsuarioRegistro = {
          ...datos,
          fechaRegistro: new Date(),
          emailVerificado: false,
          kycCompletado: false
        };
        
        this.usuariosRegistrados.set(correoLower, nuevoUsuario);
        
        // Generar código de verificación
        const codigo = this.generarCodigoVerificacion();
        this.codigosVerificacion.set(correoLower, codigo);
        
        console.log(`📧 Código de verificación para ${correoLower}: ${codigo}`);
        
        observer.next({
          success: true,
          mensaje: 'Usuario registrado exitosamente. Revisa tu correo para el código de verificación.',
          userId: correoLower
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * PASO 2: Generar código de verificación de email
   */
  private generarCodigoVerificacion(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * PASO 2: Verificar código de email
   */
  verificarCodigoEmail(correo: string, codigo: string): Observable<{ success: boolean; mensaje: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const codigoGuardado = this.codigosVerificacion.get(correoLower);
        
        if (!codigoGuardado) {
          observer.next({
            success: false,
            mensaje: 'No se encontró un código de verificación para este correo'
          });
          observer.complete();
          return;
        }

        if (codigoGuardado !== codigo) {
          observer.next({
            success: false,
            mensaje: 'Código de verificación incorrecto'
          });
          observer.complete();
          return;
        }

        // Marcar email como verificado
        const usuario = this.usuariosRegistrados.get(correoLower);
        if (usuario) {
          usuario.emailVerificado = true;
          this.usuariosRegistrados.set(correoLower, usuario);
        }

        // Eliminar código usado
        this.codigosVerificacion.delete(correoLower);

        observer.next({
          success: true,
          mensaje: 'Email verificado exitosamente'
        });
        observer.complete();
      }, 800);
    });
  }

  /**
   * PASO 2: Reenviar código de verificación
   */
  reenviarCodigoEmail(correo: string): Observable<{ success: boolean; mensaje: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.next({
            success: false,
            mensaje: 'Usuario no encontrado'
          });
          observer.complete();
          return;
        }

        // Generar nuevo código
        const nuevoCodigo = this.generarCodigoVerificacion();
        this.codigosVerificacion.set(correoLower, nuevoCodigo);
        
        console.log(`📧 Nuevo código de verificación para ${correoLower}: ${nuevoCodigo}`);

        observer.next({
          success: true,
          mensaje: 'Código reenviado exitosamente'
        });
        observer.complete();
      }, 800);
    });
  }

  /**
   * PASO 3: Actualizar datos profesionales
   */
  actualizarDatosProfesionales(
    correo: string, 
    datosProfesionales: Partial<UsuarioRegistro>
  ): Observable<{ success: boolean; mensaje: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.next({
            success: false,
            mensaje: 'Usuario no encontrado'
          });
          observer.complete();
          return;
        }

        // Actualizar datos profesionales
        Object.assign(usuario, datosProfesionales);
        this.usuariosRegistrados.set(correoLower, usuario);

        observer.next({
          success: true,
          mensaje: 'Datos profesionales actualizados'
        });
        observer.complete();
      }, 800);
    });
  }

  /**
   * PASO 4: Completar verificación KYC
   */
  completarVerificacionKYC(
    correo: string, 
    documentoINE: boolean, 
    verificacionFacial: boolean
  ): Observable<{ success: boolean; mensaje: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.next({
            success: false,
            mensaje: 'Usuario no encontrado'
          });
          observer.complete();
          return;
        }

        // Marcar KYC como completado
        usuario.kycCompletado = documentoINE && verificacionFacial;
        this.usuariosRegistrados.set(correoLower, usuario);

        observer.next({
          success: true,
          mensaje: 'Verificación KYC completada'
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * PASO 5: Finalizar registro y auto-login
   */
  finalizarRegistro(correo: string): Observable<{ success: boolean; usuario: UsuarioAutenticado }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.error({ success: false, mensaje: 'Usuario no encontrado' });
          return;
        }

        // Crear usuario autenticado
        const usuarioAutenticado = this.crearUsuarioAutenticado(usuario);
        
        // Guardar en localStorage y actualizar BehaviorSubject
        this.guardarUsuario(usuarioAutenticado);
        this.currentUserSubject.next(usuarioAutenticado);

        observer.next({
          success: true,
          usuario: usuarioAutenticado
        });
        observer.complete();
      }, 500);
    });
  }

  /**
   * LOGIN: Iniciar sesión
   */
  login(credentials: LoginCredentials): Observable<{ success: boolean; usuario?: UsuarioAutenticado; mensaje?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = credentials.correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.next({
            success: false,
            mensaje: 'Correo o contraseña incorrectos'
          });
          observer.complete();
          return;
        }

        if (usuario.contrasena !== credentials.contrasena) {
          observer.next({
            success: false,
            mensaje: 'Correo o contraseña incorrectos'
          });
          observer.complete();
          return;
        }

        // Crear usuario autenticado
        const usuarioAutenticado = this.crearUsuarioAutenticado(usuario);
        
        // Guardar en localStorage y actualizar BehaviorSubject
        this.guardarUsuario(usuarioAutenticado);
        this.currentUserSubject.next(usuarioAutenticado);

        observer.next({
          success: true,
          usuario: usuarioAutenticado
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Crear objeto de usuario autenticado
   */
  private crearUsuarioAutenticado(usuario: UsuarioRegistro): UsuarioAutenticado {
    return {
      id: usuario.correo,
      nombreCompleto: `${usuario.nombre} ${usuario.segundoNombre} ${usuario.primerApellido} ${usuario.segundoApellido}`,
      nombre: usuario.nombre,
      segundoNombre: usuario.segundoNombre, // Agregar esto
      primerApellido: usuario.primerApellido,
      segundoApellido: usuario.segundoApellido,
      correo: usuario.correo,
      especialidad: usuario.especialidad_medica,
      especialidad_medica: usuario.especialidad_medica, // Agregar esto
      cedula: usuario.cedula_profesional,
      emailVerificado: usuario.emailVerificado || false,
      kycCompletado: usuario.kycCompletado || false,
      token: this.generarToken()
    };
  }

  /**
   * Generar token mock
   */
  private generarToken(): string {
    return 'mock-token-' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): UsuarioAutenticado | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtener datos completos del usuario registrado
   */
  getUsuarioRegistrado(correo: string): UsuarioRegistro | undefined {
    return this.usuariosRegistrados.get(correo.toLowerCase());
  }

  /**
   * Obtener último código de verificación (solo para debug)
   */
  getCodigoVerificacion(correo: string): string | undefined {
    return this.codigosVerificacion.get(correo.toLowerCase());
  }
}