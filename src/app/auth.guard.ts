import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserRepository } from './Services/user-repository.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private authService: UserRepository, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isAdminLoggedIn()) {
      return true;
    } else {
      // Redirigir al usuario a la página de login si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }

}

@Injectable({
  providedIn: 'root'
})
export class TeacherAuthGuard implements CanActivate {

  constructor(private authService: UserRepository, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isTeacherLoggedIn()) {
      console.log('TeacherAuthGuard: User is logged in');
      return true;
    } else {
      console.log('TeacherAuthGuard: User is not logged in');
      this.router.navigate(['/login']);
      return false;
    }
  }

}
