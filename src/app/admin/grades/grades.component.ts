import { Router } from '@angular/router';
import { Grade } from '../../model/Grade.model';
import { GradeRepository } from './../../Services/grade-repository.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent implements OnInit {

  isLoading: boolean = false;

  grados!: Grade[];
  gradeToDelete!:Grade;
  constructor( private gradeRepository:GradeRepository, private router:Router ) {}

  ngOnInit(){
    this.cargarDatos();
  }

  cargarDatos(){
    this.isLoading = true;
    this.gradeRepository.ListGrade().then(response => {
      console.log(response);
      if(response) this.grados = response;
      this.isLoading = false;
   });
  }

  deleteGrade(id: number){
    this.gradeRepository.DeleteGrade(id).then(() => {
      this.cargarDatos();
    });
  }

  createGrade(){
    this.router.navigateByUrl(`/admin/grades/create`);
  }

  navigateToUser(id: number) {
    console.log("navegando a usuario: ", id);
    this.router.navigateByUrl(`/admin/users/info?id=${id}`);
  }

  viewGrade( grade: Grade ){
    this.router.navigateByUrl(`/admin/grades/info?id=${grade.instanceId}`);
  }
}
