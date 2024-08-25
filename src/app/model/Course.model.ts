import { Grade, GradeBase } from "./Grade.model";
import { Role, User } from "./User.model";

export class CourseBase {
  courseId!:number;
  courseName!:string;
};


export class StateBase{
  stateId!: number;
  state!: string;
};

export class Course {
  gradeCourseId!:number;
  gradeId!:number;
  courseId!:number;
  stateId!:number;
  course!: CourseBase;
  grade!: Grade;
  state!: StateBase
  teacher!: User;
};
