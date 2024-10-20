import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { authorizationInterceptor } from './authorization.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { ErrorManagementComponent } from './error-management/error-management.component';


@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    ErrorManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authorizationInterceptor,
      multi: true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
