import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { UsersComponent } from './users/users.component';
import { GradesComponent } from './grades/grades.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserInfoComponent } from './users/user-info/user-info.component';
import { GradeInfoComponent } from './grades/grade-info/grade-info.component';
import { GradeCreateComponent } from './grades/grade-create/grade-create.component';
import { GradeConfigComponent } from './grades/grade-config/grade-config.component';
import { CourseInfoComponent } from './courses/course-info/course-info.component';
import { StudentInfoComponent } from './student/student-info/student-info.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'users/create', component: UserCreateComponent },
      { path: 'users/edit', component: UserEditComponent },
      { path: 'users/info', component: UserInfoComponent },
      { path: 'users', component: UsersComponent },
      { path: 'grades', component: GradesComponent },
      { path: 'grades/create', component: GradeCreateComponent },
      { path: 'grades/info', component: GradeInfoComponent },
      { path: 'grades/config', component: GradeConfigComponent },
      { path: 'courses/info', component: CourseInfoComponent },
      { path: 'student', component: StudentComponent },
      { path: 'student/info', component: StudentInfoComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' } // Redirección por defecto sólo si la ruta es vacía
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
