import { Activity, StudentActivity } from './../model/Activity.Model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Grade } from '../model/Grade.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityRepositoryService {

  private readonly route: string = 'https://localhost:7196/Activity';

  constructor(private http: HttpClient, private router: Router) { }

  getScoresByStudent(userId: number):Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.route}/ByStudent/${userId}`);
  }

  Delete(activityId : number){
    return this.http.delete(`${this.route}/${activityId}`);
  }

  RateStudentActivity( activityId: number, studentId: number, score: number):Observable<StudentActivity> {
    return this.http.post<StudentActivity>(`${this.route}/RateStudentActivity`, {activityId, studentId, score});
  }

  Create(activity: { moduleId:number, activityName: string; description: string; maxScore: number; deadline: Date }):Observable<Activity> {
    return this.http.post<Activity>(`${this.route}`, activity);
  }

  Edit(Id:number, activity: { moduleId:number, activityName: string; description: string; maxScore: number; deadline: Date }):Observable<Activity> {
    return this.http.put<Activity>(`${this.route}/${Id}`, activity);
  }
}
