import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeRepository } from '../../../Services/grade-repository.service';
import { Grade } from '../../../model/Grade.model';
import { Course } from '../../../model/Course.model';
import { finalize } from 'rxjs';
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
    this.studentRepository.getListByGrade( this.gradeId )
    .subscribe(
      response =>{
        this.estudianes = response
        console.log(response);
      },
      error => console.error('Error:', error)
    );

    this.gradeRepository.getById( this.gradeId )
      .then(
        response =>{
          if(!response) return;
          console.log( "El Grado es: ", response);
          this.grado = response.grade;
          this.cursos = response.courses;
        }).catch( error => {
          console.error('Error:', error)
        }).finally( () => this.isLoading = false );


  }

  Actualizar(){
    console.log(this.grado);
    this.isUpdating = true;
  }

  navigateToUser(id: number) {
    console.log("navegando a usuario: ", id);
    this.router.navigateByUrl(`/admin/users/info?id=${id}`);
  }
  navigateToCourse(id: number){
    console.log("navegando a curso: ", id);
  }

  setStudentOrCourse( value: boolean ){
    this.StudentOrCourse = value;

  }
}

