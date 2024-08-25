import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRepository } from '../../Services/user-repository.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isMenuOpen = false;
  panelEnum = PanelActivo;

  profileImg!:string;

  rutaActual="";
  panelActual: PanelActivo = PanelActivo.INICIO;  // Ejemplo de uso del enum
  constructor(
    private userService:UserRepository,
    private router: Router
  ) { }

  ngOnInit() {
    this.rutaActual = this.router.url;

    switch(this.rutaActual){

      case '/admin/advertisements':
        this.panelActual = PanelActivo.INICIO;
      break

      case '/admin/users':
        this.panelActual = PanelActivo.USUARIOS;
      break

      case '/admin/grades':
        this.panelActual = PanelActivo.GRADOS;
      break
    }

    this.profileImg = this.userService.getProfileImg();
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
      case 'Anuncios':
        this.router.navigateByUrl( `admin/advertisements` );

      break

      case 'Usuarios':
        this.router.navigateByUrl( `admin/users` );
      break

      case 'Grados':
        this.router.navigateByUrl( `admin/grades` );
      break

      default:
        this.router.navigateByUrl( `admin/advertisements` );
      break
    }
  }
}

enum PanelActivo{
  INICIO = 'Anuncios',
  USUARIOS = 'Usuarios',
  GRADOS = 'Grados',
}
