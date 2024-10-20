import { Grade } from '../../../model/Grade.model';
import { Student } from '../../../model/Student.model';
import { GradeRepository } from './../../../Services/grade-repository.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'reasignacion-create',
  templateUrl: './reasignacion-create.component.html',
  styleUrl: './reasignacion-create.component.scss'
})
export class ReasignacionCreateComponent {

  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() Created = new EventEmitter<{ gradeId:number, studentId:number }>();
  @Input() studentId!: number;
  selectedGradeId!: number;
  gradosDisponibles!: Grade[];
  constructor(private gradeRepository: GradeRepository) { }

  ngOnInit() {
    this.gradeRepository.ListGrade().then(response => {
      if(response) this.gradosDisponibles = response;
   })
  }

  closeModal() {
    this.isOpen = false;
    this.studentId = 0;
    this.modalClose.emit();  // Emitir el evento al cerrar el modal
  }

  create() {
    this.Created.emit({ gradeId: this.selectedGradeId, studentId: this.studentId });
    this.closeModal();  // Cerrar el modal después de enviar los datos
  }
}
