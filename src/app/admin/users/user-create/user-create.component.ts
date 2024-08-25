import { UserRepository } from './../../../Services/user-repository.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUserDTO } from '../../../model/User.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent implements OnInit {
  userForm!: FormGroup;

  isLoading:boolean = false

  constructor(private fb: FormBuilder, private UserRepository:UserRepository, private router:Router) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(50)]],
      LastName: ['', [Validators.required, Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]],
      Phone: [''],
      ImgProfile: [null],
      Address: [''],
      Gender: ['', Validators.required],
      RoleId: [null, Validators.required]
    });
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
      this.UserRepository.Create( this.userForm.value as CreateUserDTO )
        .pipe( finalize( () => this.isLoading = false ) )
        .subscribe(
          response =>{
            this.router.navigateByUrl("/admin/users")
          },
          error => console.error('Error:', error)
        );
      }
  }
}
