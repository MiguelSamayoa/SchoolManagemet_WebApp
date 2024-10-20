import { Course } from "./Course.model";
import { User } from "./User.model";

export class GradeBase {
  gradeId!:number;
  gradeName!:string;
  active!:boolean;
};

export class Grade {
  instanceId!: number;
  professor_GuideUserId?: number;
  gradeId!:number;
  section!: string;
  year!: number;
  active!: boolean;
  grade!: GradeBase
  professor_Guide!: User
  gradeCourses!: Course[]
  gradeAssignments!: GradeAssignment[];
};

export class GradeWithCourses {
  grade!: Grade;
  courses!: Course[];
};

export class GradeAssignment {
  active!: boolean;
  assignmentId!: number;
  gradeId!: number;
  studentId!: number;
}

export class InsertGradeDTO {
  gradeId!:number;
  section!: string;
  professor_GuideUserId?: number
  year!: number;
  grade!: GradeBase
  professor_Guide!: User
  academicCicle!: number
};
