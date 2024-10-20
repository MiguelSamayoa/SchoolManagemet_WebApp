import { DisciplineRecord, EmergencyContact, MedicalInfo } from './../../../model/Student.model';
import { ActivityRepositoryService } from './../../../Services/activity-repository.service';
import { Component } from '@angular/core';
import { Payment, Student } from '../../../model/Student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentRepository } from '../../../Services/student-repository.service';
import { finalize, forkJoin } from 'rxjs';
import { Course, Module } from '../../../model/Course.model';
import { StudentInfoRepositoryService } from '../../../Services/student-info-repository.service';
import { Grade } from '../../../model/Grade.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { ErrorManagementService } from '../../../Services/error-management.service';
import { Alert } from '../../../model/Alert';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrl: './student-info.component.scss'
})
export class StudentInfoComponent {
  EmergencyContactToDelete!:EmergencyContact|null;
  medicalInfoToDelete!:MedicalInfo|null;
  recordToDelete!:DisciplineRecord|null;

  Imprimiendo = false;

  userId!: number;
  student!: Student;
  Notas = (): Course[]=>{
    return this.gradoActual.gradeCourses;
  };
  gradoActual!: Grade;
  Grados: Grade[] = [];

  isLoading = false;
  isUpdating = false;

  EditStudentModal = false;
  CreatePaymentModal = false;
  CreateEmergencyContactModal = false;
  CreateDisciplineRecordModal = false;
  CreateMedicalInfoModal = false;

  tab= "notas";

  constructor(private route: ActivatedRoute,
    private router:Router,
    private studentRepository: StudentRepository,
    private activityRepository: ActivityRepositoryService,
    private infoRepository: StudentInfoRepositoryService,
    private errorManager: ErrorManagementService
  ) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['id'];
      this.CargarData()
    });
  }

  //  - - - - - - - - - - - - - - - - - PAGOS - - - - - - - - - - - - - - - - -
  openPaymentModal() {
    console.log('Abriendo modal de pagos');
    this.CreatePaymentModal = true;
  }

  handlePaymentModalClose() {
    this.CreatePaymentModal = false;  // Cerrar el modal desde el padre
  }

  handlePaymentCreated(paymentData: { amount: number, description: string }) {
    let DTO = { amount: paymentData.amount, description: paymentData.description, studentId: this.userId }

    this.infoRepository.createPayment(DTO).then( data => {
      this.errorManager.showAlert( new Alert('success', 'Pago creado con exito') );
      this.CargarData();
    },
    error => {
      this.errorManager.showAlert( new Alert('error', 'Error al crear el pago') );
    });
  }

  //  - - - - - - - - - - - - - - - - - INFORMACION MEDICA - - - - - - - - - - - - - - - - -
  openMedicalInfoModal() {
    console.log('Abriendo modal de info medica');
    this.CreateMedicalInfoModal = true;
  }

  handleMedicalInfoModalClose() {
    this.CreateMedicalInfoModal = false;  // Cerrar el modal desde el padre
  }

  handleMedicalInfoCreated(medicalInfo: { type: number, detail: string }) {
    let DTO = { medicalInfoTypeId: medicalInfo.type, detail: medicalInfo.detail, studentId: this.userId }

    this.infoRepository.createMedicInfo(DTO).then( data => {
      this.errorManager.showAlert( new Alert('success', 'Registro medico creado con exito') );
      this.CargarData();
    },
    error => {
      this.errorManager.showAlert( new Alert('error', 'Error al crear el registro medico') );
    });
  }

  //  - - - - - - - - - - - - - - - - - RECORDS DISCIPLINARIOS - - - - - - - - - - - - - - - - -
  openRecordModal() {
    this.CreateDisciplineRecordModal = true;
  }

  handleRecordModalClose() {
    this.CreateDisciplineRecordModal = false;  // Cerrar el modal desde el padre
  }

  handleRecordCreated(records: { incidentDescription: string, actionTaken:string, severity: string }) {
    let DTO = { incidentDescription: records.incidentDescription, actionTaken: records.actionTaken, severity: records.severity, studentId: this.userId }

    console.log('DTO:', DTO);
    this.infoRepository.createDisciplineRecord(DTO).then( data => {
      this.errorManager.showAlert( new Alert('success', 'Registro diciplinario creado con exito') );
      this.CargarData();
    },
    error => {
      this.errorManager.showAlert( new Alert('error', 'Error al crear el registro diciplinario') );
    });
  }

  //  - - - - - - - - - - - - - - - - - CONTACTOS DE EMERGENCIA - - - - - - - - - - - - - - - - -
  openContactModal() {
    this.CreateEmergencyContactModal = true;
  }

  handleContactModalClose() {
    this.CreateEmergencyContactModal = false;  // Cerrar el modal desde el padre
  }

  handleContactCreated(emergencyContac: { contactName:string, phone:string, relationship:string, address:string }) {
    let DTO = { studentId: this.userId, contactName: emergencyContac.contactName, phone: emergencyContac.phone, relationship: emergencyContac.relationship, address: emergencyContac.address }

    this.infoRepository.createEmergencyContact(DTO).then( data => {
      this.errorManager.showAlert( new Alert('success', 'Contaco de emergencia creado con exito') );
      this.CargarData();
    },
    error => {
      this.errorManager.showAlert( new Alert('error', 'Error al crear el Contacto de emergencia') );
    });
  }

  //  - - - - - - - - - - - - - - - - - UTILIDADES - - - - - - - - - - - - - - - - -
  async CargarData() {
    this.isLoading = true;

    // Utilizar forkJoin para esperar a que todas las llamadas se completen
    forkJoin({
      studentInfo: this.studentRepository.getById( this.userId ),
      Asignaciones: this.activityRepository.getScoresByStudent( this.userId )
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(({ studentInfo, Asignaciones }) => {
      if(studentInfo) this.student = studentInfo;

      this.Grados = Asignaciones;
      this.gradoActual = this.Grados[0];

      console.log(Asignaciones)
      if(!studentInfo) this.errorManager.showAlert(new Alert( 'error', 'Error al cargar la informacion del estudiante' ))
    }, error => {
      this.errorManager.showAlert(new Alert( 'error', 'Error al cargar la informacion del estudiante' ))
    });

  }

  getTotalScore = (moduleData: Module): number => {
    let totalScore = 0;

    // Recorremos cada actividad en el módulo
    moduleData.activities.forEach((activity) => {
      // Recorremos cada studentActivity en la actividad y sumamos sus scores
      activity.studentActivities.forEach((studentActivity) => {
        totalScore += studentActivity.score;
      });
    });

    return totalScore;
  };

  getMaxScore = (moduleData: Module): number => {
    let totalScore = 0;

    // Recorremos cada actividad en el módulo
    moduleData.activities.forEach((activity) => {
      // Recorremos cada studentActivity en la actividad y sumamos sus scores
        totalScore += activity.maxScore;
    });

    return totalScore;
  };

  getTotalByCourse = (course: Course): string => {
    let total = 0;
    let index = 0;

    course.modules.forEach((module) => {
      total += this.getTotalScore(module);
      if (this.getMaxScore(module) > 0) index++;
    });

    return (index > 0) ? (total / index).toFixed(2) : '0.00'; // Retorna como string con dos decimales
  }

  cancelDelete(){
    this.EmergencyContactToDelete = null;
    this.medicalInfoToDelete = null;
    this.recordToDelete = null;
  }

  async delete(){
    try{
      this.isLoading = true;
      if( this.EmergencyContactToDelete ){
        console.log('El contacto a borrar es: ', this.EmergencyContactToDelete);
        await this.infoRepository.deleteEmergencyContact(this.EmergencyContactToDelete.contactId);
        this.EmergencyContactToDelete = null;
      }
      else if( this.recordToDelete ){
        console.log('El registro a borrar es: ', this.recordToDelete);
        await this.infoRepository.deleteRecords(this.recordToDelete.disciplineId);
        this.recordToDelete = null;
      }
      else if( this.medicalInfoToDelete ){
        console.log('La info medica a borrar es: ', this.medicalInfoToDelete);
        await this.infoRepository.deleteMedicalInfo(this.medicalInfoToDelete.medicalInfoId);
        this.medicalInfoToDelete = null;
      }
    }catch(error){
      console.error('Error:', error);
    }
    finally{
      this.CargarData();
    }
  }

  openStudentEdit(){
    console.log('Abriendo modal de edicion de estudiante');
    this.EditStudentModal = true;
  }

  handleStudentEditClose(){
    this.EditStudentModal = false;
  }

  handleStudentEdit(studentInfo: {firstName:string, lastName:string, dateOfBirth: Date, email: string, phone:string, gender:string, address:string, active:boolean}) {
    this.EditStudentModal = false;
    this.studentRepository.update( this.student.studentId, studentInfo ).subscribe( data => {
      console.log('Estudiante actualizado:', data);
      this.CargarData();
    },
    error => console.error('Error:', error));
  }


  exportToPDF() {
    try{
      this.Imprimiendo = true;  // Mostrar la versión simplificada

      setTimeout(() => {
        const data = document.getElementById('notasTable');

        let nombre = 'Notas'+ this.gradoActual.year+ '-' +this.student.studentId + '-' + this.gradoActual.instanceId + '_' + this.student.lastName.replaceAll(' ', '');
        if (data) {
          html2canvas(data).then(canvas => {
            const imgWidth = 295;  // Ancho ajustado para permitir márgenes (210 mm - 20 mm)
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const marginLeft = -40;
            const marginTop = 0;
            const contentDataURL = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'letter');
            const position = marginTop;

            pdf.addImage(contentDataURL, 'PNG', marginLeft, position, imgWidth, imgHeight);
            pdf.save( nombre + '.pdf');

            this.Imprimiendo = false;

            this.errorManager.showAlert( new Alert('success', 'PDF exportado con exito') );
          });
        }
      }, 500);
    }catch(error){
      this.Imprimiendo = false;
      this.errorManager.showAlert( new Alert('error', 'Error al exportar el PDF') );
    }
  }

  nextCourse(){
    let index = this.Grados.indexOf(this.gradoActual) + 1;
    this.gradoActual = this.Grados[index];
    console.log(index);
  }
  prevCourse(){
    let index = this.Grados.indexOf(this.gradoActual) - 1;
    this.gradoActual = this.Grados[index];
    console.log(index);
  }
}
