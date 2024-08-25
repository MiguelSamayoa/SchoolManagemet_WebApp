import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserRepository } from '../../Services/user-repository.service';
import { User } from '../../model/User.model';
import { finalize } from 'rxjs';

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

  StudentStat:number = 0;
  AdminStat!:number;
  TeacherStat!:number;

  constructor(private userRepository: UserRepository, private router:Router) {}

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

          this.AdminStat = this.usuarios.filter(x => x.role.roleId == 1).length;
          this.TeacherStat = this.usuarios.filter(x => x.role.roleId == 2).length;

        },
        error => console.error('Error:', error)
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
          this.CargarData()
        },
        error => console.error('Error:', error)
      );
  }
}
