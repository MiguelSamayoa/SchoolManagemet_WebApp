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

        if(decodedPayload['Role'] != "Teacher") return false;
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

        if (decodedPayload['Role'] === "Teacher") {
          this.router.navigate(['Teacher']);
        }
        else if (decodedPayload['Role'] === "admin") {
          this.router.navigateByUrl('/admin');
        }
        else {

          console.warn('Role not recognized');
          this.router.navigate(['Login']);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.router.navigate(['Login']);
      }
    } else {
      this.router.navigate(['Login']);
    }
  }

  /*

  AvailableTeachers() : Promise<any>{
    return this.http.get<User[]>(`${this.route}/AvailableTeachers`).toPromise()
  }



  async UpdateUser(user: User, changedUser: any): Promise<User | null> {
    console.log("Usuario Modificado", changedUser);
    console.log("Usuario Actual", user);

    const formData = new FormData();
    if (user.firstName !== changedUser.firstName) formData.append('FirstName', changedUser.firstName);
    if (user.lastName !== changedUser.lastName) formData.append('LastName', changedUser.lastName);
    if (user.email !== changedUser.email) formData.append('Email', changedUser.email);
    if (user.role !== changedUser.rol) formData.append('Rol', changedUser.rol.toString());

    try {
      const usuario = await this.http.put<User>(`${this.route}/${user.id}`, formData).toPromise();
      return usuario ? usuario : null;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return null;
    }
  }

  createUser(user: any): Promise<User|undefined> {
    return this.http.post<User>(`${this.route}`, user).toPromise();
  }

  getById( Id:number ): Promise<User|undefined>{
    return this.http.get<User>(`${this.route}/ById/${Id}`).toPromise();
  }



  getUserCourse(): Promise<any> {
    return this.http.get<viewUserCourse[][]>(`${this.route}/GetViewTeacher`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los cursos de usuario:', error);
          return of<viewUserCourse[]>([]);
        })
      )
      .toPromise();
  }

  */
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

