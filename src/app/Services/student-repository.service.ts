import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Student} from '../model/Student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentRepository {
  private readonly route: string = 'https://localhost:7196/Student';

  constructor(private http: HttpClient ) {
  }

  getListByGrade( id:number ): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.route}/ByGrade/${id}`);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.route}/ById/${id}`);
  }

  create(DTO : {
    student: {firstName:string, lastName:string, dateOfBirth: Date, email: string, phone:string, gender:string, address:string, active:boolean},
    gradeId: number
  }): Observable<Student> {
    return this.http.post<Student>(this.route, DTO);
  }

  update(Id:number, Dto:{firstName:string, lastName:string, dateOfBirth: Date, email: string, phone:string, gender:string, address:string, active:boolean}): Observable<Student> {
    return this.http.put<Student>(`${this.route}/${Id}`, Dto);
  }

  delete(Id:number): Observable<Student> {
    return this.http.delete<Student>(`${this.route}/${Id}`);
  }

  enable(Id:number): Observable<Student> {
    return this.http.get<Student>(`${this.route}/Enable/${Id}`);
  }

  reassign(DTO : { studentId:number, gradeId: number }): Observable<boolean> {
    return this.http.post<boolean>(`${this.route}/Reassign`, DTO);
  }

  reassignAll( DTO : { students: { studentId: number, active: boolean }[], newGrade: number, oldGrade:number } ): Observable<boolean> {
    return this.http.post<boolean>(`${this.route}/ReassignAll`, DTO);
  }
}
