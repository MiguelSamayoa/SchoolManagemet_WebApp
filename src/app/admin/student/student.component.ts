import { Component } from '@angular/core';
import { GradeWithStudent, Student } from '../../model/Student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeRepository } from '../../Services/grade-repository.service';
import { finalize, forkJoin } from 'rxjs';
import { ErrorManagementService } from '../../Services/error-management.service';
import { Alert } from '../../model/Alert';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {

  isLoading = false;
  grados!: GradeWithStudent[];

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private gradeRepository: GradeRepository,
    private errorManager: ErrorManagementService
  ) { }

  async ngOnInit() {
    this.CargarData()
  }

  async CargarData() {
    this.isLoading = true;

    forkJoin({
      grados: this.gradeRepository.ListWithStudent(),
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(( {grados} ) => {
      if(grados) this.grados = grados;
      if(!this.grados) this.errorManager.showAlert( new Alert('warning', 'No se encontraron registros') );

    }, error => {
      this.errorManager.showAlert( new Alert('error', 'Error al cargar los grados') )

    });

  }

  // gradosActivos = () :GradeWithStudent[] => this.grados.filter( g => g.active );
  gradosActivos():GradeWithStudent[] {
    if (!this.grados || !Array.isArray(this.grados)) {
      return [];
    }
    return this.grados.filter(grado => grado.active);
  }

  //gradosInactivos = () :GradeWithStudent[] => this.grados.filter( g => !g.active );
  gradosInactivos():GradeWithStudent[] {
    if (!this.grados || !Array.isArray(this.grados)) {
      return [];
    }
    return this.grados.filter(grado => !grado.active);
  }
}
