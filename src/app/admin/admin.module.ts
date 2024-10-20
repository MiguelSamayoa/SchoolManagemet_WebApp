import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { GradesComponent } from './grades/grades.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserInfoComponent } from './users/user-info/user-info.component';
import { GradeInfoComponent } from './grades/grade-info/grade-info.component';
import { GradeEditComponent } from './grades/grade-edit/grade-edit.component';
import { GradeCreateComponent } from './grades/grade-create/grade-create.component';
import { GradeConfigComponent } from './grades/grade-config/grade-config.component';
import { PaymentCreateComponent } from './student/payment-create/payment-create.component';
import { InfoMedicaCreateComponent } from './student/info-medica-create/info-medica-create.component';
import { DisciplineRecordCreateComponent } from './student/discipline-record-create/discipline-record-create.component';
import { EmergencyContactCreateComponent } from './student/emergency-contact-create/emergency-contact-create.component';
import { StudentInfoComponent } from './student/student-info/student-info.component';
import { StudentFormularioComponent } from './student/student-formulario/student-formulario.component';
import { StudentComponent } from './student/student.component';
import { StudentTableComponent } from './student/student-table/student-table.component';
import { ReasignacionCreateComponent } from './student/reasignacion-create/reasignacion-create.component';
import { ReasignacionAllComponent } from './student/reasignacion-all/reasignacion-all.component';
import { CourseTableComponent } from './courses/course-table/course-table.component';
import { CourseInfoComponent } from './courses/course-info/course-info.component';
import { NotasTableComponent } from './courses/notas-table/notas-table.component';
import { BoletaEvaluacionComponent } from '../boleta-evaluacion/boleta-evaluacion.component';

@NgModule({
  declarations: [
    HomeComponent,
    UsersComponent,
    GradesComponent,
    UserCreateComponent,
    UserEditComponent,
    UserInfoComponent,
    GradeInfoComponent,
    GradeEditComponent,
    GradeCreateComponent,
    GradeConfigComponent,
    StudentInfoComponent,
    PaymentCreateComponent,
    InfoMedicaCreateComponent,
    DisciplineRecordCreateComponent,
    EmergencyContactCreateComponent,
    StudentFormularioComponent,
    StudentComponent,
    StudentTableComponent,
    ReasignacionCreateComponent,
    ReasignacionAllComponent,
    CourseTableComponent,
    CourseInfoComponent,
    NotasTableComponent,
    BoletaEvaluacionComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
