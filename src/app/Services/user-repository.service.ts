import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User, CreateUserDTO, UserWithCourses, UpdateUser } from '../model/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserRepository {
  private readonly route: string = 'https://localhost:7196/User';
  private readonly TOKEN_KEY = 'authToken';

  constructor(private http: HttpClient, private router: Router ) {

  }

  getListUser(): Observable<User[]> {
    return this.http.get<User[]>(this.route);
  }

  getListByRole(Id:number): Observable<User[]> {
    return this.http.get<User[]>(`${this.route}/ByRole/${Id}`);
  }

  getById(Id:number): Observable<User> {
    return this.http.get<User>(`${this.route}/${Id}`)
  }

  Delete(Id:number): Observable<User> {
    return this.http.delete<User>(`${this.route}/Disable/${Id}`)
  }

  Create( user:CreateUserDTO ):  Observable<any>{
    console.log(user)
    const formData = new FormData();
    formData.append('FirstName', user.FirstName);
    formData.append('LastName', user.LastName);
    formData.append('Email', user.Email);
    formData.append('Password', user.Password)
    if (user.Phone) formData.append('Phone', user.Phone);
    if (user.ImgProfile) formData.append('ImgProfile', user.ImgProfile);
    if (user.Address) formData.append('Address', user.Address)
    if (user.Gender) formData.append('Gender', user.Gender);
    if (user.RoleId) formData.append('RoleId', user.RoleId.toString());

    return this.http.post( this.route, formData )
  }

  UpdateUser( id:number,  user:UpdateUser ):  Observable<any>{
    const formData = new FormData();
    formData.append('FirstName', user.FirstName);
    formData.append('LastName', user.LastName);
    formData.append('Email', user.Email);
    if (user.Phone) formData.append('Phone', user.Phone);
    if (user.ImgProfile) formData.append('ImgProfile', user.ImgProfile);
    if (user.Address) formData.append('Address', user.Address)
    if (user.Gender) formData.append('Gender', user.Gender);
    if (user.RoleId) formData.append('RoleId', user.RoleId.toString());

    return this.http.put( `${this.route}/${id}`, formData )
  }

  getProfileImg():string{
    let token = localStorage.getItem(this.TOKEN_KEY);
    if (token!==null) {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

        return decodedPayload.ProfileImg ? decodedPayload.ProfileImg : '';
    }
    return '';
  }

  async login(correo:string, contraseña:string) {
    const datosLogin :formularioLogin = new formularioLogin(correo, contraseña);

    return this.http.post<any>(`${this.route}/Login`, datosLogin).toPromise().then(response => {
      localStorage.setItem(this.TOKEN_KEY, response.token);
    })

  }

  logout(){
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['login']);
  }

  isLoggedIn(){
    let logAsAdmnin = this.isAdminLoggedIn();
    let logAsTeacher = this.isTeacherLoggedIn();

    if(logAsAdmnin || logAsTeacher){
      return true;
    }
    return false;
  }

  isAdminLoggedIn(): boolean {
    let token = localStorage.getItem(this.TOKEN_KEY);
    if (token!==null) {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedPayload.exp);

        if(expirationDate < new Date()){
          this.logout();
          return false;
        }

        if(decodedPayload['Role'] != "admin") return false;
        //this.changePage();
        return true
    }
    return false;
  }

  isTeacherLoggedIn(): boolean {
    let token = localStorage.getItem(this.TOKEN_KEY);
    if (token!==null) {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

        const expirationDate = new Date(0); // La fecha inicial Unix (1 de enero de 1970)
        expirationDate.setUTCSeconds(decodedPayload.exp);

        if(expirationDate < new Date()){
          this.logout();
          return false; // Retorna true si hay token y no ha expirado
        }

        if(decodedPayload['Role'] != "teacher") return false;
        //this.changePage();
        return true
    }
    return false; // Retorna false si no hay token o si el token ha expirado
  }

  changePage(){
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (token) {
      try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

        if (decodedPayload['Role'] === "teacher") {
          console.warn('Es maestro el pndejo');
          this.router.navigateByUrl('teacher');
        }
        else if (decodedPayload['Role'] === "admin") {
          this.router.navigateByUrl('/admin');
        }
        else {
          console.warn('Role not recognized');
          this.router.navigate(['login']);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.router.navigate(['login']);
      }
    } else {
      console.warn('No token found');
      this.router.navigate(['login']);
    }
  }

  getIdUser(): number {
    let token = localStorage.getItem(this.TOKEN_KEY);
    if (token!==null) {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload['Id'];
    }
    return 0;
  }
}



export class formularioLogin{
  email: string;
  password:string;
  constructor( email: string, password: string) {
    this.email = email;
    this.password = password
  }
}

export class viewUserCourse{

  id:number = 0;
  firstName:string = ''
  lastName:string = ''
  email: string= '';
  rol: string= "";
  courses:viewCourseByUser[] = []
  constructor( ) {}
}

export class viewCourseByUser{
  idCourse:number = 0
  course:string = ''
  idGrade:number = 0
  academicLevel:string = ''

  constructor( ) {}
}

