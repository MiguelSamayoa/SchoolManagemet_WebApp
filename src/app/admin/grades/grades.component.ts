import { Router } from '@angular/router';
import { Grade } from '../../model/Grade.model';
import { GradeRepository } from './../../Services/grade-repository.service';
import { Component, OnInit } from '@angular/core';
import { ErrorManagementService } from '../../Services/error-management.service';
import { Alert } from '../../model/Alert';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent implements OnInit {

  isLoading: boolean = false;

  grados!: Grade[];
  gradeToDelete!:Grade;
  constructor(
    private gradeRepository:GradeRepository,
    private router:Router,
    private errorManagement: ErrorManagementService
  ) {}

  ngOnInit(){
    this.cargarDatos();
  }

  cargarDatos(){
    this.isLoading = true;
    this.gradeRepository.ListGrade().then(response => {
      if(response) this.grados = response;
      this.isLoading = false;
   }).catch(() => {
      this.errorManagement.showAlert( new Alert('error', 'Error al cargar los grados') );
      this.isLoading = false;
   });
  }

  deleteGrade(id: number){
    this.isLoading = true;

    this.gradeRepository.DeleteGrade(id).then(() => {
      this.errorManagement.showAlert( new Alert('success', 'Grado eliminado correctamente') );
      this.cargarDatos();
      this.isLoading = false;
    }).catch(() => {
      this.errorManagement.showAlert( new Alert('error', 'Error al cargar los grados') );
      this.isLoading = false;
   });
  }

  createGrade(){
    this.router.navigateByUrl(`/admin/grades/create`);
  }
  navigateToConfig() {
    this.router.navigateByUrl(`/admin/grades/config`);
  }

  navigateToUser(id: number) {
    this.router.navigateByUrl(`/admin/users/info?id=${id}`);
  }

  viewGrade( grade: Grade ){
    this.router.navigateByUrl(`/admin/grades/info?id=${grade.instanceId}`);
  }
}
