import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRepository } from '../../../Services/user-repository.service';
import { catchError, finalize, forkJoin, of  } from 'rxjs';
import { User, UserWithCourses } from '../../../model/User.model';
import { Course } from '../../../model/Course.model';
import { CoursesRepositoryService } from '../../../Services/courses-repository.service';
import { ErrorManagementService } from '../../../Services/error-management.service';
import { Alert } from '../../../model/Alert';

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
    private courseRepository: CoursesRepositoryService,
    private errorManagement: ErrorManagementService
  ) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['id'];
      this.CargarData()
    });
  }

  updatingToggle(){
    this.isLoading = false;
    this.isUpdating = false;
    this.CargarData()
  }

  loadingToggle(){
    this.isLoading = !this.isLoading;
  }

  async CargarData() {
    this.isLoading = true;


    forkJoin({
      usuario: this.userRepository.getById(this.userId).pipe(
        catchError(error => {
          console.error('Error obteniendo usuario:', error);
          return of(null); // Devuelve null si falla la petición
        })
      ),
      cursos: this.courseRepository.ListByUser(this.userId).pipe(
        catchError(error => {
          console.error('Error obteniendo cursos:', error);
          return of([]); // Devuelve un array vacío si falla la petición
        })
      )
    }).subscribe(
      response => {
        if(response.usuario) this.usuario = response.usuario;
        if(response.cursos) this.cursos = response.cursos;

        if (!this.usuario) {
          this.errorManagement.showAlert( new Alert( 'error','Error al cargar el usuario') );
        }
        if (this.cursos?.length === 0) {
          this.errorManagement.showAlert( new Alert( 'warning','No hay cursos Asignados' ) );
        }
      },
      error => {
        this.errorManagement.showAlert( new Alert( 'error','Error al cargar los datos') );
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  navigateToCourse(id: number) {
    this.router.navigateByUrl(`/admin/courses/info?id=${id}`);
  }
  navigateToGrade(id: number) {
    this.router.navigateByUrl(`/admin/grades/info?id=${id}`);
  }
  Actualizar(){
    console.log(this.usuario);
    this.isUpdating = true;
  }
}
