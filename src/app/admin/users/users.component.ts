import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserRepository } from '../../Services/user-repository.service';
import { User } from '../../model/User.model';
import { finalize } from 'rxjs';
import { ErrorManagementService } from '../../Services/error-management.service';
import { Alert } from '../../model/Alert';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  isCreated:boolean = false
  isLoading:boolean = false;

  userToDelete!:User;

  usuarios: User[] = [];

  constructor(private errorManagement: ErrorManagementService, private userRepository: UserRepository, private router:Router) {}

  async ngOnInit() {
    await this.CargarData();
  }

  async CargarData() {
    this.isLoading = true;
    this.userRepository.getListUser()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        response =>{
          this.usuarios = response
        },
        error => {
          this.errorManagement.showAlert( new Alert( 'error','Error al cargar los usuarios'));
        }
      );
  }

  viewUser( user: User ){
    this.router.navigateByUrl(`/admin/users/info?id=${user.userId}`);
  }

  createUser(){
    this.router.navigateByUrl("/admin/users/create");
  }

  deleteUser( id:number ){
    this.isLoading = true;

    this.userRepository.Delete( id )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        response =>{
          this.errorManagement.showAlert( new Alert( 'success','Datos eliminados correctamente') );
          this.CargarData()
        },
        error => {
          this.errorManagement.showAlert( new Alert( 'error', 'Error al eliminar el usuario'));
        }
      );
  }
}
