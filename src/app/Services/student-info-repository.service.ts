import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { MedicalInfoType } from '../model/Student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentInfoRepositoryService {

  private readonly route: string = 'https://localhost:7196/StudentInfo';

  constructor(private http: HttpClient, private router: Router) { }

  public async getMedicalInfoType(): Promise<MedicalInfoType[]> {
    return await lastValueFrom(this.http.get<MedicalInfoType[]>(`${this.route}/MedicalCategories`));
  }


  public async createPayment( DTO:{ studentId : number, amount: number, description: string } ){
    return await lastValueFrom(this.http.post(`${this.route}/Payment`, DTO));
  }

  public async createMedicInfo( DTO:{ studentId : number, medicalInfoTypeId: number, detail: string } ){
    return await lastValueFrom(this.http.post(`${this.route}/MedicalInfo`, DTO));
  }

  public async createDisciplineRecord( DTO:{ studentId : number, incidentDescription: string, actionTaken:string, severity: string } ){
    return await lastValueFrom(this.http.post(`${this.route}/Records`, DTO));
  }

  public async createEmergencyContact( DTO:{ studentId: number, contactName: string, phone: string, relationship: string, address: string } ){
    console.log('DTO:', DTO);
    return await lastValueFrom(this.http.post(`${this.route}/EmergencyContact`, DTO));
  }


  public async deleteMedicalInfo(id: number) {
    return await lastValueFrom(this.http.delete(`${this.route}/MedicalInfo/${id}`));
  }
  public async deleteRecords(id: number) {
    return await lastValueFrom(this.http.delete(`${this.route}/Records/${id}`));
  }
  public async deleteEmergencyContact(id: number) {
    return await lastValueFrom(this.http.delete(`${this.route}/EmergencyContact/${id}`));
  }
}
