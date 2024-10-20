import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'payment-create',
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.scss']
})
export class PaymentCreateComponent {
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() Created = new EventEmitter<{ amount: number, description: string }>();

  closeModal() {
    this.isOpen = false;
    this.modalClose.emit();  // Emitir el evento al cerrar el modal
  }

  create() {
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;

    this.Created.emit({ amount: Number(amount), description });
    this.closeModal();  // Cerrar el modal después de enviar los datos
  }
}
