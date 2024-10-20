import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeRepository } from '../../../Services/grade-repository.service';
import { Grade } from '../../../model/Grade.model';
import { Course } from '../../../model/Course.model';
import { finalize, forkJoin } from 'rxjs';
import { Student } from '../../../model/Student.model';
import { StudentRepository } from '../../../Services/student-repository.service';

@Component({
  selector: 'app-grade-info',
  templateUrl: './grade-info.component.html',
  styleUrl: './grade-info.component.scss'
})
export class GradeInfoComponent {

  gradeId!: number;

  grado!:Grade;
  cursos!:Course[];
  estudianes!:Student[];

  isLoading = false;
  isUpdating = false;
  StudentOrCourse = true;


  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private gradeRepository: GradeRepository,
    private studentRepository: StudentRepository
  ) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.gradeId = +params['id'];
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

    forkJoin({
      studentsByGrade: this.studentRepository.getListByGrade( this.gradeId ),
      gradoInfo: this.gradeRepository.getById( this.gradeId )
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(( {studentsByGrade, gradoInfo} ) => {

      if(studentsByGrade) this.estudianes = studentsByGrade;

      if(!gradoInfo) return;
      this.grado = gradoInfo.grade;
      this.cursos = gradoInfo.courses;
      console.log(this.cursos);
    }, error => console.error('Error:', error));
  }

  Actualizar(){
    console.log(this.grado);
    this.isUpdating = true;
  }

  navigateToUser(id: number) {
    this.router.navigateByUrl(`/admin/users/info?id=${id}`);
  }

  navigateToStudent(id: number) {
    this.router.navigateByUrl(`/admin/student/info?id=${id}`);
  }
  setStudentOrCourse( value: boolean ){
    this.StudentOrCourse = value;
  }


}

