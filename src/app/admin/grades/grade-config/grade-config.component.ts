import { Component } from '@angular/core';
import { GradeRepository } from '../../../Services/grade-repository.service';
import { Router } from '@angular/router';
import { GradeBase } from '../../../model/Grade.model';
import { finalize, forkJoin } from 'rxjs';
import { CoursesRepositoryService } from '../../../Services/courses-repository.service';
import { CourseBase, CourseTemplate, InsertCourseTemplateDTO } from '../../../model/Course.model';
import { ErrorManagementService } from '../../../Services/error-management.service';
import { Alert } from '../../../model/Alert';

@Component({
  selector: 'app-grade-config',
  templateUrl: './grade-config.component.html',
  styleUrl: './grade-config.component.scss'
})
export class GradeConfigComponent {

  CatalogoGrados!: GradeBase[]
  CatalogoCursos!: CourseBase[]

  AcualyTempletes: CourseTemplate[] = []

  gradeOrCourse: boolean = true
  isLoading:boolean = false

  constructor(
    private gradeRepository:GradeRepository,
    private courseRepository:CoursesRepositoryService,
    private router:Router,
    private errorManagement: ErrorManagementService
  ) {}
  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      grados: this.gradeRepository.GetCatalogo(),
      cursos: this.courseRepository.GetCatalogo(),
      plantillas: this.courseRepository.GetPlantillas()
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(({ grados, cursos, plantillas }) => {
      this.CatalogoGrados = grados;
      this.CatalogoCursos = cursos;
      this.AcualyTempletes = plantillas;

      this.errorManagement.showAlert( new Alert('success', 'Datos cargados correctamente') );
    }, error => {
      this.errorManagement.showAlert( new Alert('error', 'Error al cargar los datos') );
    });
  }


  isTemplateActive(gradeId: number, courseId: number): boolean {
    return this.AcualyTempletes.some(template => template.gradeId === gradeId && template.courseId === courseId);
  }

  onTemplateChange(event: Event, gradeId: number, courseId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.isTemplateActive(gradeId, courseId)) {
        this.AcualyTempletes.push(new CourseTemplate(gradeId, courseId));
      }
    } else {
      this.AcualyTempletes = this.AcualyTempletes.filter(template => !(template.gradeId === gradeId && template.courseId === courseId));
    }
  }

  saveChanges(){
    const activeCourses = this.CatalogoCursos.filter(course => course.active);
    const activeGrades = this.CatalogoGrados.filter(grade => grade.active);

    let dto: InsertCourseTemplateDTO = {
      Courses: activeCourses,
      Grades: activeGrades,
      Templates: this.AcualyTempletes
    };

    this.courseRepository.PostPlantillas(dto).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe( () => {
      this.errorManagement.showAlert( new Alert('success', 'Plantillas actualizadas correctamente') );
    }, error =>{
      this.errorManagement.showAlert( new Alert('error', 'Error al actualizar las plantillas') );
    });;
  }

  toggleGrade( IdGrade:number ){
    let grado = this.CatalogoGrados.find(x => x.gradeId === IdGrade);

    if( grado ){
      grado.active = !grado.active;

      if( !grado?.active ){
        this.AcualyTempletes = this.AcualyTempletes.filter(x => x.gradeId !== IdGrade);
      }
    }

  }

  toggleCourse( IdCourse:number ){
    let curso = this.CatalogoCursos.find(x => x.courseId === IdCourse);

    if( curso ){
      curso.active = !curso.active;

      if( !curso?.active ){
        this.AcualyTempletes = this.AcualyTempletes.filter(x => x.courseId !== IdCourse);
      }
    }

  }
}
