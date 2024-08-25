import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GradeBase, GradeWithCourses, InsertGradeDTO } from '../model/Grade.model';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Grade } from '../model/Grade.model';

@Injectable({
  providedIn: 'root'
})
export class GradeRepository {
  private readonly route: string = 'https://localhost:7196/Grade';

  constructor(private http: HttpClient, private router: Router) { }

  async ListGrade() : Promise<Grade[] | undefined> {
    return await this.http.get<Grade[]>(this.route).toPromise();
  }

  async getById(id: number): Promise<GradeWithCourses|undefined> {
    return this.http.get<GradeWithCourses>(`${this.route}/${id}`).toPromise();
  }

  // async UpdateGrade(Grade: GradeWithManager, changedGrade:any): Promise<GradeWithManager|null> {

  //   const formData = new FormData();

  //   // Suponiendo que Grade y changedGrade son objetos con las propiedades manager, academic_Level, etc.
  //   if (Grade.managerId !== changedGrade.manager) formData.append('manager', changedGrade.manager);
  //   if (Grade.academic_Level !== changedGrade.academic_Level) formData.append('academic_Level', changedGrade.level);
  //   if (Grade.state !== changedGrade.state) formData.append('state', changedGrade.state);

  //   try {
  //     const usuario = await this.http.put<GradeWithManager>(`${this.route}/${Grade.id}`, formData).toPromise();
  //     return usuario ? usuario : null;
  //   } catch (error) {
  //     console.error("Error al actualizar el usuario:", error);
  //     return null;
  //   }
  // }

  async DeleteGrade( Id: number ) : Promise<void> {
    await this.http.delete(`${this.route}/${Id}`).toPromise();
  }

  async Create(grade: InsertGradeDTO) : Promise<void> {
    await this.http.post(this.route, grade).toPromise();
  }

  async Update( Id:number, grade: InsertGradeDTO) : Promise<void> {
    await this.http.put(`${this.route}/${Id}`, grade).toPromise();
  }

  GetCatalogo(): Observable<GradeBase[]> {
    return this.http.get<GradeBase[]>(`${this.route}/GradeCatalogo`);
  }

  // async CreateGrade(grade: any) : Promise<GradeWithManager> {
  //   this.http.post<GradeWithManager>(this.route, grade).toPromise().then(response => {
  //     console.log( "La respuesta es: ", response);
  //     if(response)return response;
  //     return new GradeWithManager();
  //   }).catch(error => {
  //     console.log( "El error es: ", error);
  //     return new GradeWithManager();
  //   });
  //   return new GradeWithManager();
  // }

  // ---------------------------------------------------------------------------------------------
}
