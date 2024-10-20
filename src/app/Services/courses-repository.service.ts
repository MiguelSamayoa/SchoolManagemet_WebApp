import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Course, CourseBase, CourseTemplate, InsertCourseTemplateDTO } from '../model/Course.model';
import { Observable, of } from 'rxjs';
import { User } from '../model/User.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesRepositoryService {
  private readonly route: string = 'https://localhost:7196/Course';

  constructor(private http: HttpClient, private router: Router) { }

  SendToRevision( isAprobado :boolean, courseId: number): Observable<void> {
    console.log(isAprobado);
    return this.http.post<void>(`${this.route}/SendToRevision/${courseId}`, isAprobado);
  }
  SolicitarAprobacion(courseId: number): Observable<void> {
    return this.http.get<void>(`${this.route}/SolicitarAprobacion/${courseId}`);
  }
  Info( courseId:number ) : Observable<Course> {
    return this.http.get<Course>(`${this.route}/Info/${courseId}`);
  }
  ListByUser(userId:number ) : Observable<Course[]> {
    return this.http.get<Course[]>(`${this.route}/ByUser/${userId}`);
  }
  async ListByGrade(gradeId: number): Promise<Course|undefined> {
    return this.http.get<Course>(`${this.route}/ByGrade/${gradeId}`).toPromise();
  }

  GetCatalogo(): Observable<CourseBase[]> {
    return this.http.get<CourseBase[]>(`${this.route}/Catalogo`);
  }

  GetPlantillas(): Observable<CourseTemplate[]> {
    return this.http.get<CourseTemplate[]>(`${this.route}/Plantillas`);
  }

  PostPlantillas( plantillas: InsertCourseTemplateDTO) {
    return this.http.post(`${this.route}/Plantillas`, plantillas);
  }

  setTeacher(gradeId: number, teacherId: number):Observable<Course> {
    return this.http.post<Course>(`${this.route}/${gradeId}/SetTeacher/${teacherId}`, null);
  }

  getAviableTeachers():Observable<User[]> {
    return this.http.get<User[]>(`${this.route}/AviableTeachers`);
  }
}
