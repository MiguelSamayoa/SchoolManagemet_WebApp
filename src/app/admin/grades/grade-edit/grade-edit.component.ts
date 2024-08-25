import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeBase, InsertGradeDTO } from '../../../model/Grade.model';
import { User } from '../../../model/User.model';
import { GradeRepository } from '../../../Services/grade-repository.service';
import { Router } from '@angular/router';
import { UserRepository } from '../../../Services/user-repository.service';
import { finalize } from 'rxjs';
import { Grade } from '../../../model/Grade.model';

@Component({
  selector: 'grade-edit',
  templateUrl: './grade-edit.component.html',
  styleUrl: './grade-edit.component.scss'
})
export class GradeEditComponent {

  userForm!: FormGroup;

  @Input() Grade!: Grade;
  @Output() updatingEmitter: EventEmitter<void> = new EventEmitter();
  @Output() loadingEmitter: EventEmitter<void> = new EventEmitter();

  Seccion: string[] = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
  CatalogoGrados!: GradeBase[]
  Teaches!: User[]
  thisYear = new Date().getFullYear();

  isLoading:boolean = false

  constructor(
    private fb: FormBuilder,
    private gradeRepository:GradeRepository,
    private router:Router,
    private userRepository:UserRepository
  ) {}

  ngOnInit(): void {

    this.isLoading = true;
    this.gradeRepository.GetCatalogo()
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(
      response =>{
        this.CatalogoGrados = response
        console.log(this.CatalogoGrados);
      },
      error => console.error('Error:', error)
    );

    this.userRepository.getListUser()
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(
      response =>{
        this.Teaches = response
        console.log(this.Teaches);
      },
      error => console.error('Error:', error)
    );


    this.userForm = this.fb.group({
      professorGuide: [this.Grade.professor_GuideUserId, [Validators.min(1)]],
      year: [this.Grade.year, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      section: [this.Grade.section, [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      gradeId: [this.Grade.gradeId, [Validators.required, Validators.min(1)]],
    });

    this.isLoading = false;
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
      console.log( this.userForm.value );

      this.isLoading = true;
      this.gradeRepository.Update( this.Grade.gradeId, this.userForm.value as InsertGradeDTO )
        .then( response => {
            this.isLoading = false;
            this.router.navigateByUrl("/admin/grades")
          })
        .catch( error =>{
          this.isLoading = false;
        });
      }
  }
}
