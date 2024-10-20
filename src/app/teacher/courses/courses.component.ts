import { UserRepository } from './../../Services/user-repository.service';
import { Component } from '@angular/core';
import { Grade } from '../../model/Grade.model';
import { GradeRepository } from '../../Services/grade-repository.service';
import { Router } from '@angular/router';
import { CoursesRepositoryService } from '../../Services/courses-repository.service';
import { Course } from '../../model/Course.model';
import { ErrorManagementService } from '../../Services/error-management.service';
import { Alert } from '../../model/Alert';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {

  isLoading: boolean = false;

  cursos!: Course[];

  usuario:number = this.UserRepository.getIdUser();
  constructor(
    private courseRepository:CoursesRepositoryService,
    private router:Router,
    private UserRepository:UserRepository,
    private errorManagement:ErrorManagementService
  ) {}

  ngOnInit(){
    this.cargarDatos();
  }

  cargarDatos(){
    this.isLoading = true;
    this.courseRepository.ListByUser( this.usuario ).subscribe(response => {
      if(response) this.cursos = response;
      else this.errorManagement.showAlert( new Alert('warning', 'No hay cursos asignados') );
      this.isLoading = false;
   } );
  }

  navigateToUser(id: number) {
    this.router.navigateByUrl(`/teacher/users/info?id=${id}`);
  }

  viewCourse( course: Course ){
    this.router.navigateByUrl(`/teacher/courses/info?id=${course.gradeCourseId}`);
  }

  EstadoActual = (course: Course): { index: number; state: string } => {
    const allStateIdOne = course.modules.every(module => module.state.stateId === 1);
    if (allStateIdOne) {
      return { index: 0, state: course.modules[0].state.state }; // Retorna el estado del primer módulo
    }

    // Verificar si hay algún stateId == 2
    for (let i = 0; i < course.modules.length; i++) {
      if (course.modules[i].state.stateId === 2 ||course.modules[i].state.stateId === 3) {
        const allPreviousStateIdThree = course.modules
          .slice(0, i)
          .every(module => module.state.stateId === 1 || module.state.stateId === 4);
        if (allPreviousStateIdThree) {
          return { index: i, state: course.modules[i].state.state }; // Retorna el estado del módulo encontrado
        }
      }
    }
    return { index: -1, state: 'No hay módulos en estado 2' };
  };

}
