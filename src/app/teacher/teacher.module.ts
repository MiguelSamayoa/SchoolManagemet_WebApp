import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeacherHomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseInfoComponent } from './courses/course-info/course-info.component';
import { ActivityFormComponent } from './courses/activity-form/activity-form.component';
import { NotasTableComponent } from './courses/notas-table/notas-table.component';


@NgModule({
  declarations: [
    TeacherHomeComponent,
    CoursesComponent,
    CourseInfoComponent,
    ActivityFormComponent,
    NotasTableComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TeacherModule { }
