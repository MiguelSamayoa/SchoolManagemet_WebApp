import { UserRepository } from './../../../Services/user-repository.service';
import { GradeRepository } from './../../../Services/grade-repository.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { GradeBase, InsertGradeDTO } from '../../../model/Grade.model';
import { User } from '../../../model/User.model';
import { ErrorManagementService } from '../../../Services/error-management.service';
import { Alert } from '../../../model/Alert';

@Component({
  selector: 'app-grade-create',
  templateUrl: './grade-create.component.html',
  styleUrl: './grade-create.component.scss'
})
export class GradeCreateComponent {

  userForm!: FormGroup;

  Seccion: string[] = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
  CatalogoGrados!: GradeBase[]
  Teaches!: User[]
  thisYear = new Date().getFullYear();

  isLoading:boolean = false

  constructor(
    private fb: FormBuilder,
    private gradeRepository:GradeRepository,
    private router:Router,
    private userRepository:UserRepository,
    private errorManagement:ErrorManagementService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      catalogoGrados: this.gradeRepository.GetCatalogo(),
      teaches: this.userRepository.getListByRole(2)
    })
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: ({ catalogoGrados, teaches }) => {
        this.CatalogoGrados = catalogoGrados;
        this.Teaches = teaches;
      },
      error: (err) => {
        this.errorManagement.showAlert(new Alert('error', 'Error al cargar los datos'));
      }
    });

    this.userForm = this.fb.group({
      professorGuide: [0, [Validators.min(1)]],
      year: [this.thisYear, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      section: ['A', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      gradeId: [0, [Validators.required, Validators.min(1)]],
      academicCicle: ['Bimestre', [Validators.required]],
    });

    console.log(this.userForm.value);
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.userForm.patchValue({
        ImgProfile: file
      });
    }
  }

  onSubmit(): void {
    if ( this.userForm.valid ) {

      this.isLoading = true;
      this.gradeRepository.Create( this.userForm.value as InsertGradeDTO )
        .then( response => {
            this.isLoading = false;
            this.errorManagement.showAlert( new Alert( 'success','Grado creado correctamente') );
            this.router.navigateByUrl("/admin/grades")
          })
        .catch( error =>{
          this.isLoading = false;
          this.errorManagement.showAlert( new Alert( 'success','Error al crear el grado') );
        });
      }
  }

}
