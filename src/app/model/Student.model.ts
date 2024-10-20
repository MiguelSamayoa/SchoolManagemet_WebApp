import { StudentActivity } from "./Activity.Model";
import { Grade } from "./Grade.model";

export class Student {
  studentId!:number;
  firstName!:string;
  lastName!:string;
  dateOfBirth!: Date;
  gender!:string;
  address!:string;
  phone!:string;
  email!:string
  active!:boolean;
  attendances!: Attendance[];
  disciplineRecords!: DisciplineRecord[];
  emergencyContacts!: EmergencyContact[];
  gradeAssignments!: GradeAssignment[];
  medicalInfos!: MedicalInfo[];
  payments!: Payment[];
  studentActivities!: StudentActivity[];
}

export class Attendance {

}

export class DisciplineRecord {
  disciplineId!: number;
  studentId!: number;
  incidentDate!: Date;
  incidentDescription!: string;
  actionTaken!: string;
  severity!: string;
}

export class EmergencyContact {
  contactId!: number;
  studentId!: number;
  contactName!: string;
  relationship!: string;
  phone!: string;
  address!: string;
}

export class GradeAssignment {
  assignmentId!: number;
  studentId!: number;
  gradeId!: number;
  grade!: Grade; // Relación con Grade
  student!:Student
}

export class MedicalInfo {
  medicalInfoId!: number;
  studentId!: number;
  medicalInfoTypeId!: number;
  detail!: string;
  medicalInfoType!: MedicalInfoType; // Relación con MedicalInfoType
}

export class MedicalInfoType  {
  medicalInfoTypeId!: number;
  typeName!: string;
}

export class Payment {
  paymentId!: number;
  studentId!: number;
  paymentDate!: Date;  // TypeScript utiliza Date para fechas
  amount!: number;     // TypeScript no tiene un tipo decimal, se usa number
  description!: string;
}


export class GradeWithStudent {
  students!: Student[]
  active!:boolean
  gradeId!: number
  gradeName!: string
  year!:number
  teacherName!:string
  section!: string
}
