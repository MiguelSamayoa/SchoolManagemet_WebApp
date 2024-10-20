export class Alert {
  type!: 'info' | 'success' | 'warning' | 'error'
  Mensaje!: string
  fadeOut?: boolean;
  constructor(type: 'info' | 'success' | 'warning' | 'error', Mensaje: string) {
    this.type = type
    this.Mensaje = Mensaje
  }
}
