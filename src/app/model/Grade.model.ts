import { Course } from "./Course.model";
import { User } from "./User.model";

export class GradeBase {
  gradeId!:number;
  gradeName!:string;
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
};

export class GradeWithCourses {
  grade!: Grade;
  courses!: Course[];
};

export class InsertGradeDTO {
  gradeId!:number;
  section!: string;
  professor_GuideUserId?: number
  year!: number;
  grade!: GradeBase
  professor_Guide!: User
};
