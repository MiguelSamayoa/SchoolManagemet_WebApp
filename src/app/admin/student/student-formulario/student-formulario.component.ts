import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Student } from '../../../model/Student.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StudentRepository } from '../../../Services/student-repository.service';

@Component({
  selector: 'student-formulario',
  templateUrl: './student-formulario.component.html',
  styleUrl: './student-formulario.component.scss'
})
export class StudentFormularioComponent implements OnChanges {
  studentForm!: FormGroup;
  @Input() isCreate = false;
  @Input() student = new Student();
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() SendStudent = new EventEmitter<{firstName:string, lastName:string, dateOfBirth: Date, email: string, phone:string, gender:string, address:string, active:boolean}>();

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private studentRepository: StudentRepository) {
    this.initializeForm();
  }

  // Método para inicializar el formulario
  private initializeForm() {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      active: [true]
    });
  }

  // Método que se ejecuta cuando cambian los inputs
  ngOnChanges(changes: SimpleChanges) {
    this.updateFormWithStudentData();
  }

  // Método para actualizar el formulario con los datos del estudiante recibido
  private updateFormWithStudentData() {
    if (this.student) {
      const formattedDate = this.datePipe.transform(this.student.dateOfBirth, 'yyyy-MM-dd');

      this.studentForm.patchValue({
        firstName: this.student.firstName || '',
        lastName: this.student.lastName || '',
        dateOfBirth: formattedDate || '',
        email: this.student.email || '',
        phone: this.student.phone || '',
        gender: this.student.gender || '',
        address: this.student.address || '',
        active: this.student.active ?? true
      });
    }
  }

  SendInfo() {
    let student = this.studentForm.value;
    student.dateOfBirth = new Date(student.dateOfBirth);
    this.SendStudent.emit(student);
  }

  closeModal() {
    this.isOpen = false;
    this.modalClose.emit();
  }

  openModal() {
    this.isOpen = true;
    console.log('Abriendo modal de estudiante', this.student);
  }
}
