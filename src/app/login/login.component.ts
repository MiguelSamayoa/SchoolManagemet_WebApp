import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { UserRepository } from '../Services/user-repository.service';
import { ErrorManagementService } from '../Services/error-management.service';
import { Alert } from '../model/Alert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  isLoading = false;
  loginForm!: FormGroup;

  constructor(private userService : UserRepository, private fb: FormBuilder, private errorManagement: ErrorManagementService) {
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
    this.checkIfIsLogged();

  }

  async login() {
    this.isLoading = true
    await this.userService.login(this.loginForm.value.email, this.loginForm.value.password)
    .then(data => {
      this.userService.changePage();
    }).catch (error => {
      console.log(error);
      if(error.status == 401){
        this.errorManagement.showAlert( new Alert( 'error','Usuario o contraseña incorrectos'));
      }
    }).finally(() =>{
      this.isLoading = false
    })
  }

  checkIfIsLogged(){
    if( this.userService.isLoggedIn()){
      this.userService.changePage();
    }
  }
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
