import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { UsersComponent } from './users/users.component';
import { GradesComponent } from './grades/grades.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserInfoComponent } from './users/user-info/user-info.component';
import { GradeInfoComponent } from './grades/grade-info/grade-info.component';
import { GradeEditComponent } from './grades/grade-edit/grade-edit.component';
import { GradeCreateComponent } from './grades/grade-create/grade-create.component';


@NgModule({
  declarations: [
    HomeComponent,
    AdvertisementsComponent,
    UsersComponent,
    GradesComponent,
    UserCreateComponent,
    UserEditComponent,
    UserInfoComponent,
    GradeInfoComponent,
    GradeEditComponent,
    GradeCreateComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
