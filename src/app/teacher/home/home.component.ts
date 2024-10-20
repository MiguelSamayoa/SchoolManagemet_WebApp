import { Course } from './../../model/Course.model';
import { Component } from '@angular/core';
import { UserRepository } from '../../Services/user-repository.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'teacher-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class TeacherHomeComponent {

  isMenuOpen = false;
  panelEnum = PanelActivo;

  profileImg!:string;

  rutaActual="";
  panelActual: PanelActivo = PanelActivo.COURSE;  // Ejemplo de uso del enum
  constructor(
    private userService:UserRepository,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Asignar inmediatamente la ruta actual al iniciar el componente
    this.rutaActual = this.router.url;
    this.actualizarPanel(this.rutaActual);

    // Suscribirse a eventos de navegación para actualizar el panel según la ruta
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.rutaActual = event.urlAfterRedirects;

        this.actualizarPanel(this.rutaActual);
      });

    // Obtener la imagen de perfil del servicio
    this.profileImg = this.userService.getProfileImg();
  }

  // Método para actualizar el panel actual basado en la ruta
  actualizarPanel(ruta: string): void {
    if (ruta.includes('courses')) {
      this.panelActual = PanelActivo.COURSE;
    } else if (ruta.includes('users')) {
      this.panelActual = PanelActivo.USUARIOS;
    } else if (ruta.includes('student')) {
      this.panelActual = PanelActivo.STUDENT;
    }
  }

  closeMenu( panel: PanelActivo ) {
    this.panelActual = panel;
    this.actualizarRuta()
  }
  toggleMenu( ) {
    this.isMenuOpen = !this.isMenuOpen;
  }

  CerrarSesion(){
    this.userService.logout();
  }

  actualizarRuta(){

    switch(this.panelActual.valueOf()){
      case 'Usuarios':
        this.router.navigateByUrl( `teacher/users` );
      break

      case 'Cursos':
        this.router.navigateByUrl( `teacher/courses` );
      break

      case 'Estudiantes':
        this.router.navigateByUrl( `teacher/student` );
      break

      default:
        this.router.navigateByUrl( `teacher/courses` );
      break
    }
  }
}

enum PanelActivo{
  COURSE = 'Cursos',
  USUARIOS = 'Usuarios',
  STUDENT = 'Estudiantes',
}
