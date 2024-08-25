import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRepository } from '../../../Services/user-repository.service';
import { finalize } from 'rxjs';
import { User, UserWithCourses } from '../../../model/User.model';
import { Course } from '../../../model/Course.model';
import { CoursesRepositoryService } from '../../../Services/courses-repository.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  userId!: number;

  usuario:User = new User();
  cursos!:Course[];

  isLoading = false;
  isUpdating = false;

  constructor(private route: ActivatedRoute,
    private router:Router,
    private userRepository: UserRepository,
    private courseRepository: CoursesRepositoryService
  ) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['id'];
      this.CargarData()
    });
  }

  updatingToggle(){
    console.log( "Actualizando " );
    this.isLoading = false;
    this.isUpdating = false;
    this.CargarData()
  }

  loadingToggle(){
    console.log( "Cargando " );
    this.isLoading = !this.isLoading;
  }

  async CargarData() {
    this.isLoading = true;
    this.userRepository.getById( this.userId )
      .subscribe(
        response =>{
          this.usuario = response;
          console.log(response);
        },
        error => {
          console.error('Error:', error)
        }
      );
    this.courseRepository.ListByUser(this.userId)
      .subscribe(
        response =>{
          this.cursos = response;
          console.log(response);
        },
        error => {
          console.error('Error:', error)
        }
      );

    this.isLoading = false;
  }

  navigateToGrade(id: number) {
    this.router.navigateByUrl(`/admin/grades/info?id=${id}`);
  }
  Actualizar(){
    console.log(this.usuario);
    this.isUpdating = true;
  }
}
