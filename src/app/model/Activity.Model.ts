import { Student } from "./Student.model";

export class Activity {
  activityId!: number;
  moduleId!: number;
  activityName!: string;
  description!: string;
  maxScore!: number;
  deadline!: Date;
  studentActivities!: StudentActivity[];
}

export class StudentActivity {
  studentActivityId!: number;
  studentId!: number;
  activityId!: number;
  score!: number;
  
  student!: Student;
}
