import { CoursesComponent } from './courses/courses.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherHomeComponent } from './home/home.component';
import { CourseInfoComponent } from './courses/course-info/course-info.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherHomeComponent,
    children: [
      { path: 'courses', component: CoursesComponent },
      { path: 'courses/info', component: CourseInfoComponent },
      { path: '', redirectTo: 'courses', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
