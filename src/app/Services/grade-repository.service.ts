import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GradeBase, GradeWithCourses, InsertGradeDTO } from '../model/Grade.model';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Grade } from '../model/Grade.model';
import { Student } from '../model/Student.model';

@Injectable({
  providedIn: 'root'
})
export class GradeRepository {
  private readonly route: string = 'https://localhost:7196/Grade';

  constructor(private http: HttpClient, private router: Router) { }

  async ListGrade() : Promise<Grade[] | undefined> {
    return await this.http.get<Grade[]>(this.route).toPromise();
  }

  async GetNextGrade(id:number) : Promise<Grade[] | undefined> {
    return await this.http.get<Grade[]>(`${this.route}/NexGrade/${id}`).toPromise();
  }

  async ListWithStudent() : Promise<{ students: Student[], active:boolean, gradeId: number, gradeName: string, year:number, teacherName:string, section: string }[] | undefined> {
    return await this.http.get<{ students: Student[], active:boolean, gradeId: number, gradeName: string, year:number, teacherName:string, section: string }[]>(`${this.route}/WithStudent`).toPromise();
  }

  getById(id: number): Observable<GradeWithCourses> {
    return this.http.get<GradeWithCourses>(`${this.route}/${id}`);
  }

  async DeleteGrade( Id: number ) : Promise<void> {
    await this.http.delete(`${this.route}/${Id}`).toPromise();
  }

  async CreateEmpty(grade: InsertGradeDTO) : Promise<void> {
    await this.http.post(`${this.route}/Empty`, grade).toPromise();
  }

  async Create(grade: InsertGradeDTO) : Promise<void> {
    await this.http.post(this.route, grade).toPromise();
  }

  async Update( Id:number, grade: InsertGradeDTO) : Promise<void> {
    await this.http.put(`${this.route}/${Id}`, grade).toPromise();
  }

  GetCatalogo(): Observable<GradeBase[]> {
    return this.http.get<GradeBase[]>(`${this.route}/Catalogo`);
  }
}
