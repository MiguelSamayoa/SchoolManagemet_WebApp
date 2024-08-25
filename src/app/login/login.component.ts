import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { UserRepository } from '../Services/user-repository.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;

  constructor(private userService : UserRepository, private fb: FormBuilder){
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
    this.checkIfIsLogged();

  }

  async login() {
    console.log("Intentando...")
    await this.userService.login(this.loginForm.value.email, this.loginForm.value.password)
    .then(data => {
      console.log("Conexion")
      this.userService.changePage();
    }).catch (error => {
      console.log(error);
    })
  }

  checkIfIsLogged(){
    if(this.userService.isLoggedIn()){
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
