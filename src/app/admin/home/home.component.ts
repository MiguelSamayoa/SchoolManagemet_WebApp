import { Student } from './../../model/Student.model';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserRepository } from '../../Services/user-repository.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isMenuOpen = false;
  panelEnum = PanelActivo;

  profileImg!:string;

  rutaActual="";
  panelActual: PanelActivo = PanelActivo.INICIO;  // Ejemplo de uso del enum
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
    if (ruta.includes('advertisements')) {
      this.panelActual = PanelActivo.INICIO;
    } else if (ruta.includes('users')) {
      this.panelActual = PanelActivo.USUARIOS;
    } else if (ruta.includes('grades')) {
      this.panelActual = PanelActivo.GRADOS;
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
        this.router.navigateByUrl( `admin/users` );
      break

      case 'Grados':
        this.router.navigateByUrl( `admin/grades` );
      break

      case 'Estudiantes':
        this.router.navigateByUrl( `admin/student` );
      break

      default:
        this.router.navigateByUrl( `admin/users` );
      break
    }
  }
}

enum PanelActivo{
  INICIO = 'Anuncios',
  USUARIOS = 'Usuarios',
  GRADOS = 'Grados',
  STUDENT = 'Estudiantes',
}
