import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRepository } from '../../../Services/user-repository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateUser, User } from '../../../model/User.model';
import { finalize } from 'rxjs';
import { ErrorManagementService } from '../../../Services/error-management.service';
import { Alert } from '../../../model/Alert';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {

  @Input() Usuario!: User;
  @Output() updatingEmitter: EventEmitter<void> = new EventEmitter();
  @Output() loadingEmitter: EventEmitter<void> = new EventEmitter();

  userForm!: FormGroup;


  imgURL: any;

  constructor(private errorManagement:ErrorManagementService, private fb: FormBuilder, private userRepository:UserRepository, private router:Router) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      FirstName: [this.Usuario.firstName, [Validators.required, Validators.maxLength(50)]],
      LastName: [this.Usuario.lastName, [Validators.required, Validators.maxLength(50)]],
      Email: [this.Usuario.email, [Validators.required, Validators.email]],
      Phone: [this.Usuario.phone],
      ImgProfile: [null],
      Address: [this.Usuario.address],
      Gender: [this.Usuario.gender, Validators.required],
      RoleId: [this.Usuario.role.roleId, Validators.required]
    });

    if(this.Usuario.imgProfile){
      this.imgURL = this.Usuario.imgProfile;
    }
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.userForm.patchValue({
        ImgProfile: file
      });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgURL = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  close(){
    this.updatingEmitter.emit();
  }

  onSubmit(): void {
    if ( this.userForm.valid ) {
      this.loadingEmitter.emit();

      this.userRepository.UpdateUser( this.Usuario.userId, this.userForm.value as UpdateUser ).subscribe(response =>{
            this.errorManagement.showAlert( new Alert( 'success','Datos cargados correctamente') );
            this.updatingEmitter.emit();
          },
          error => {
            this.errorManagement.showAlert( new Alert( 'error','Error al actualizar el usuario'));
            this.loadingEmitter.emit();
          }
        );
    }
  }

}
