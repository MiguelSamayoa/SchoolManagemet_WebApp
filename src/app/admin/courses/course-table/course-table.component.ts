import { Component, Input, OnInit } from '@angular/core';
import { Course } from '../../../model/Course.model';
import { Router } from '@angular/router';
import { CoursesRepositoryService } from '../../../Services/courses-repository.service';
import { User } from '../../../model/User.model';

@Component({
  selector: 'course-table',
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.scss'
})
export class CourseTableComponent implements OnInit {
  @Input() cursos!: Course[];

  avaiableTeachers!: User[];

  reasignTeacher!: { courseId: number, teacherId: number };
  constructor(private router: Router, private courseRepository: CoursesRepositoryService) {}

  ngOnInit(): void {
    this.courseRepository.getAviableTeachers().subscribe((teachers) => {
      this.avaiableTeachers = teachers;
      console.log(this.avaiableTeachers);
    });
  }

  Cambiando( courseId: number ) {
    this.reasignTeacher = { courseId:courseId, teacherId: 0 };
  }

  cancelando() {
    this.reasignTeacher = { courseId: 0, teacherId: 0 };
  }

  GuardarTeacher() {
    this.courseRepository.setTeacher(this.reasignTeacher.courseId, this.reasignTeacher.teacherId).subscribe(data => {
      console.log(data);

      const index = this.cursos.findIndex((c) => c.gradeCourseId === data.gradeCourseId);

      if (index !== -1) {
        console.log("index: ", index);
        this.cursos[index] = data;
      }
    });
    this.reasignTeacher = { courseId: 0, teacherId: 0 };
  }



  navigateToCourse(id: number){
    this.router.navigateByUrl(`/admin/courses/info?id=${id}`);
  }
  navigateToUser(id: number) {
    this.router.navigateByUrl(`/admin/users/info?id=${id}`);
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
