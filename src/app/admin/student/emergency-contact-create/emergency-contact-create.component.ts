import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmergencyContact } from '../../../model/Student.model';

@Component({
  selector: 'emergency-contact-create',
  templateUrl: './emergency-contact-create.component.html',
  styleUrl: './emergency-contact-create.component.scss'
})
export class EmergencyContactCreateComponent {
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() Created = new EventEmitter<{ contactName:string, phone:string, relationship:string, address:string }>();

  Contact:EmergencyContact = new EmergencyContact();
  closeModal() {
    this.isOpen = false;
    this.Contact = new EmergencyContact();
    this.modalClose.emit();  // Emitir el evento al cerrar el modal
  }

  createPayment() {
    let contactName = this.Contact.contactName;
    let phone = this.Contact.phone;
    let relationship = this.Contact.relationship;
    let address = this.Contact.address;

    this.Created.emit({ contactName, phone, relationship, address });
    this.closeModal();  // Cerrar el modal después de enviar los datos
  }
}
