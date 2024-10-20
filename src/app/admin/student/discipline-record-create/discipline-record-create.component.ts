import { DisciplineRecord } from './../../../model/Student.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'discipline-record-create',
  templateUrl: './discipline-record-create.component.html',
  styleUrl: './discipline-record-create.component.scss'
})
export class DisciplineRecordCreateComponent {
  @Input() isOpen = false;
  //@Input() incidentDescription = '';
  @Output() modalClose = new EventEmitter<void>();
  @Output() Created = new EventEmitter<{ incidentDescription: string, actionTaken:string, severity: string }>();

  DisciplineRecord = new DisciplineRecord();
  closeModal() {
    this.isOpen = false;
    this.DisciplineRecord = new DisciplineRecord();
    this.modalClose.emit();  // Emitir el evento al cerrar el modal
  }

  create() {
    let incidentDescription = this.DisciplineRecord.incidentDescription;
    let actionTaken = this.DisciplineRecord.actionTaken;
    let severity = this.DisciplineRecord.severity;

    this.Created.emit({ incidentDescription, actionTaken, severity });
    this.closeModal();  // Cerrar el modal después de enviar los datos
  }
}
