import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Student} from '../model/Student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentRepository {
  private readonly route: string = 'https://localhost:7196/7';

  constructor(private http: HttpClient ) {

  }
  getListByGrade( id:number ): Observable<Student[]> {
    return this.http.get<Student[]>(this.route);
  }
}
