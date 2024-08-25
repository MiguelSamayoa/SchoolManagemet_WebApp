import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Course } from '../model/Course.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesRepositoryService {
  private readonly route: string = 'https://localhost:7196/Course';

  constructor(private http: HttpClient, private router: Router) { }

  ListByUser(userId:number ) : Observable<Course[]> {
    return this.http.get<Course[]>(`${this.route}/ByUser/${userId}`);
  }
  async ListByGrade(gradeId: number): Promise<Course|undefined> {
    return this.http.get<Course>(`${this.route}/ByGrade/${gradeId}`).toPromise();
  }
}
