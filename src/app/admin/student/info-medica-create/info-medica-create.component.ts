import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudentInfoRepositoryService } from '../../../Services/student-info-repository.service';
import { MedicalInfo, MedicalInfoType } from '../../../model/Student.model';

@Component({
  selector: 'info-medica-create',
  templateUrl: './info-medica-create.component.html',
  styleUrl: './info-medica-create.component.scss'
})
export class InfoMedicaCreateComponent implements OnInit {
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() Created = new EventEmitter<{ type: number, detail: string }>();

  medicInfoType !: MedicalInfoType[];

  MedicInfo : MedicalInfo = new MedicalInfo();

  constructor( private InfoRepository: StudentInfoRepositoryService ) {
  }

  async ngOnInit() {
    this.medicInfoType = await this.InfoRepository.getMedicalInfoType();
  }

  closeModal() {
    this.isOpen = false;
    this.MedicInfo = new MedicalInfo();
    this.modalClose.emit();  // Emitir el evento al cerrar el modal
  }

  create() {
    let type = this.MedicInfo.medicalInfoTypeId;
    let detail = this.MedicInfo.detail;

    this.Created.emit({ type, detail });
    this.closeModal();  // Cerrar el modal después de enviar los datos
  }
}
