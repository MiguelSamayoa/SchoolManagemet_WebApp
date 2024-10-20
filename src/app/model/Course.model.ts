import { Activity } from "./Activity.Model";
import { Grade, GradeBase } from "./Grade.model";
import { Role, User } from "./User.model";

export class CourseBase {
  courseId!:number;
  courseName!:string;
  active!:boolean;
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
  teacher!: User;
  modules!: Module[];
};
export class Module {
  moduleId!: number;
  courseId!: number;
  state!: StateBase
  activities!: Activity[];
  course!: Course;
};
export class CourseTemplate {
  courseTemplateId!:number;
  gradeId!:number;
  courseId!:number;

  course!: CourseBase;
  grade!: Grade;

  constructor( gradeId:number, courseId:number){
    this.gradeId = gradeId;
    this.courseId = courseId;
  }
};

export class InsertCourseTemplateDTO {
  Courses!: CourseBase[];
  Grades!: GradeBase[];
  Templates!: CourseTemplate[];
};


