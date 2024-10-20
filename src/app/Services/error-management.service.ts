import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../model/Alert';

@Injectable({
  providedIn: 'root'
})
export class ErrorManagementService {

  private activeSubject = new BehaviorSubject<boolean>(false);
  active$ = this.activeSubject.asObservable();

  // Otro BehaviorSubject para emitir el tipo y mensaje
  private alertSubject = new BehaviorSubject<Alert[]>([]);
  alert$ = this.alertSubject.asObservable();

  showAlert(alert: Alert, duration: number = 3000) {
    const currentAlerts = this.alertSubject.getValue();
    this.alertSubject.next([...currentAlerts, alert]); // Agrega la nueva alerta
    this.activeSubject.next(true);

    setTimeout(() => {
      this.hideAlert(alert); // Oculta la alerta específica
    }, duration);
  }

  showAlerts(alerts: Alert[], duration: number = 3000) {
    const currentAlerts = this.alertSubject.getValue();
    this.alertSubject.next([...currentAlerts, ...alerts]); // Agrega las nuevas alertas
    this.activeSubject.next(true);

    setTimeout(() => {
      alerts.forEach(alert => this.hideAlert(alert)); // Oculta cada alerta
    }, duration);
  }

  hideAlert(alert: Alert) {
    const currentAlerts = this.alertSubject.getValue();
    const filteredAlerts = currentAlerts.filter(a => a !== alert); // Filtra la alerta que se quiere ocultar
    this.alertSubject.next(filteredAlerts); // Actualiza la lista de alertas
    if (filteredAlerts.length === 0) {
      this.activeSubject.next(false); // Desactiva el estado si no hay alertas
    }
  }
}
