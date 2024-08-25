
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

}

export class EmergencyContact {

}

export class GradeAssignment {

}

export class MedicalInfo {

}

export class Payment {

}

export class StudentActivity {

}
