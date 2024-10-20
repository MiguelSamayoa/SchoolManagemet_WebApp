import { Component } from '@angular/core';
import { ErrorManagementService } from '../Services/error-management.service';
import { Alert } from '../model/Alert';

@Component({
  selector: 'error-management',
  templateUrl: './error-management.component.html',
  styleUrl: './error-management.component.scss'
})
export class ErrorManagementComponent {

  active: boolean = false;

  Alerts!:Alert[];
  constructor(private errorService: ErrorManagementService) {}

  ngOnInit(): void {
    this.errorService.active$.subscribe(isActive => this.active = isActive);
    this.errorService.alert$.subscribe(alerts => {
      this.Alerts = alerts.map(alert => ({ ...alert, fadeOut: false }));  // Inicializamos `fadeOut` en false
      this.handleAlertTimeout();
    });
  }

  handleAlertTimeout() {
    const displayTime = 4000;
    const fadeTime = 500;

    setTimeout(() => {
      this.Alerts = this.Alerts.map(alert => ({ ...alert, fadeOut: true }));
      setTimeout(() => {
        this.Alerts = [];
      }, fadeTime);

    }, displayTime);
  }
}
