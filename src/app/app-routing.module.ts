import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminModule } from './admin/admin.module'
import { AdminAuthGuard, TeacherAuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Ruta predeterminada
  { path: 'login', component: LoginComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AdminAuthGuard] },
  { path: 'teacher', loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule), canActivate: [TeacherAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
