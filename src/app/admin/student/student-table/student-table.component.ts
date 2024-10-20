import { Student } from './../../../model/Student.model';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentRepository } from '../../../Services/student-repository.service';
import { ErrorManagementService } from '../../../Services/error-management.service';
import { Alert } from '../../../model/Alert';

@Component({
  selector: 'student-by-grade',
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.scss'
})
export class StudentTableComponent {
  modal: any;
  @Output() needReload = new EventEmitter<void>();
  @Input() students!: Student[];
  @Input() gradeId!: number;
  @Input() canCreate!: boolean;
  @Input() viewUnactives!: boolean;
  @Input() canReassign!: boolean;
  @Input() canReassignAll!: boolean;

  studentToReassign!: Student;
  studentToDelete!: Student;

  StudentModal = false;
  reassingModal = false;
  reassingAllModal = false;

  modalId:string = this.generateRandomString(10);
  constructor(
    private router:Router,
    private studentRepository: StudentRepository,
    private el: ElementRef,
    private errorManager: ErrorManagementService
  ) {  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'A';
    const charactersLength = characters.length;

    for (let i = 1; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  openStudentEdit(){
    this.StudentModal = true;
  }

  handleStudentClose(){
    this.StudentModal = false;
  }

  handleStudentCreate(studentInfo: {firstName:string, lastName:string, dateOfBirth: Date, email: string, phone:string, gender:string, address:string, active:boolean}) {
    let DTO = {
      student: studentInfo,
      gradeId: this.gradeId
    }

    console.log(DTO);
    this.studentRepository.create( DTO ).subscribe({
      next: (student) => {
        this.students.push(student);
        this.StudentModal = false;
        this.errorManager.showAlert( new Alert('success', 'Estudante creado exitosamente') );
      },
      error: (err) => {
        if(err.status === 404) this.errorManager.showAlert( new Alert('error', 'Error de conexion') );
        else this.errorManager.showAlert( new Alert('error', 'Error al crear el estudiante') );
      }
    });
  }

  openModal(student: any) {
    console.log(this.modal);
    this.studentToDelete = student;
    this.modal.showModal();
  }

  closeModal() {
    this.modal.nativeElement.close();
  }

  ngAfterViewInit() {
    const element = this.el.nativeElement.querySelector(`#${this.modalId}`);  // Buscar el modal por ID único
    if (element) {
      this.modal = element;
    }
  }

  navigateToStudent(id: number) {
    this.router.navigateByUrl(`/admin/student/info?id=${id}`);
  }

  delete() {
    this.studentRepository.delete(this.studentToDelete.studentId).subscribe({
      next: () => {
        const student = this.students.find(student => student.studentId === this.studentToDelete.studentId);
        if (student) {
          student.active = false;
        }
        this.studentToDelete = new Student();
        this.errorManager.showAlert( new Alert('success', 'Estudiante eliminado exitosamente') );
      },
      error: (err) => {
        this.errorManager.showAlert( new Alert('error', 'Error al eliminar el estudiante') );
      }
    });
  }

  reincorporar( Id: number ) {
    this.studentRepository.enable(Id).subscribe({
      next: () => {
        const student = this.students.find( student => student.studentId === Id );
        if (student) {
          student.active = true;
        }
        this.errorManager.showAlert( new Alert('success', 'Estudiante reincorporado exitosamente') );
      },
      error: (err) => {
        this.errorManager.showAlert( new Alert('error', 'Error al reincorporar el estudiante') );
      }
    });

  }

  openReassignModal(Student: Student) {
    this.studentToReassign = Student;
    this.reassingModal = true;
  }

  closeReassignModal() {
    this.reassingModal = false;
  }

  createAssingStudent( DTO: { gradeId: number, studentId: number } ) {
    this.studentRepository.reassign( DTO ).subscribe({
      next: () => {
        this.closeReassignModal();
        this.requestReload();
        this.errorManager.showAlert( new Alert('success', 'Estudiante reasignado exitosamente') );

      },
      error: (err) => {
        this.errorManager.showAlert( new Alert('error', 'Error al reasignar el estudiante') );
      }
    });

    this.closeReassignModal()
  }

  openReassignAllModal() {
    this.reassingAllModal = true;
  }

  closeReassignAllModal() {
    this.reassingAllModal = false;
  }

  reassignAllStudent( DTO:{ students: { studentId: number, active: boolean }[], newGrade: number } ) {
    console.log(DTO);
    let request = { students: DTO.students, newGrade: DTO.newGrade, oldGrade: this.gradeId };
    this.studentRepository.reassignAll( request ).subscribe({
      next: () => {
        this.errorManager.showAlert( new Alert('success', 'Estudiantes reasignados exitosamente') );
        this.closeReassignAllModal();
        this.requestReload();
      },
      error: (err) => {
        this.errorManager.showAlert( new Alert('error', 'Error al reasignar los estudiantes') );
      }
    });

    this.closeReassignModal()
  }

  requestReload(){
    this.needReload.emit();
  }
  estudiantesActivos = () :Student[] => this.students.filter( estudiante => estudiante.active );
  estudiantesInactivos = () :Student[] => this.students.filter( estudiante => !estudiante.active );

}
