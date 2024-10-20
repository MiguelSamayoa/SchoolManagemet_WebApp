import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Grade } from '../../../model/Grade.model';
import { GradeRepository } from '../../../Services/grade-repository.service';
import { Student } from '../../../model/Student.model';

@Component({
  selector: 'reasignacion-all',
  templateUrl: './reasignacion-all.component.html',
  styleUrl: './reasignacion-all.component.scss'
})

export class ReasignacionAllComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() Students: Student[] = [];
  @Output() modalClose = new EventEmitter<void>();
  @Output() Created = new EventEmitter<{ students: { studentId: number, active: boolean }[], newGrade: number }>();
  @Input() gradeId: number = 0;

  selectedGradeId: number = 0;
  gradosDisponibles: Grade[] = [];

  estudiantesGraduados: { studentId: number, active: boolean }[] = [];

  constructor(private gradeRepository: GradeRepository) {}

  ngOnChanges(changes: SimpleChanges) {
    // Cuando el modal se abre, actualizamos los estudiantes y cargamos los grados
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      this.actualizarEstudiantesGraduados();

      this.gradeRepository.GetNextGrade(this.gradeId).then(response => {
        if (response) this.gradosDisponibles = response;
      });
    }
  }

  // Función para generar la lista de estudiantes graduados
  actualizarEstudiantesGraduados() {
    if (this.Students && this.Students.length > 0) {
      this.estudiantesGraduados = this.Students.map(student => ({
        studentId: student.studentId,
        active: true
      }));
    } else {
      this.estudiantesGraduados = [];
    }
  }

  closeModal() {
    this.isOpen = false;
    this.gradeId = 0;
    this.modalClose.emit();  // Emitir el evento al cerrar el modal
  }

  create() {
    this.Created.emit({ newGrade: this.selectedGradeId, students: this.estudiantesGraduados });
    this.closeModal();
  }
}
