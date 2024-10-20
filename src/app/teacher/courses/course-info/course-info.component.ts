import { Module } from './../../../model/Course.model';
import { StudentRepository } from './../../../Services/student-repository.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesRepositoryService } from '../../../Services/courses-repository.service';
import { forkJoin, finalize } from 'rxjs';
import { Course } from '../../../model/Course.model';
import { Student } from '../../../model/Student.model';
import { Activity } from '../../../model/Activity.Model';
import { ActivityRepositoryService } from '../../../Services/activity-repository.service';
import { ErrorManagementService } from '../../../Services/error-management.service';
import { Alert } from '../../../model/Alert';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrl: './course-info.component.scss'
})
export class CourseInfoComponent implements OnInit {

  isLoading: boolean = false;
  isActivityFormModalOpen: boolean = false;
  isCreatingActivity: boolean = false;

  creatingInModal: number = 0;
  activityToDelete: number = 0;

  tab:string = 'Alumnos';

  courseId: number = 0;
  actividadIdToView: number = 0;
  Curso!:Course;
  Estudiantes!:Student[];
  SelectedToEdit!:Activity;

  ModuleToViewNotes!:Module;

  constructor(
    private route: ActivatedRoute,
    private courseRepository:CoursesRepositoryService,
    private StudentRepository: StudentRepository,
    private activityRepository: ActivityRepositoryService,
    private errorManagement: ErrorManagementService
  ){ }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.courseId = +params['id'];
      this.CargarData()
    });
  }

  CargarData(){
    this.isLoading = true;

    this.courseRepository.Info( this.courseId ).subscribe( (data) => {
      this.StudentRepository.getListByGrade( data.gradeId ).subscribe( (students) => {
        this.Curso = data;
        this.Estudiantes = students;
        this.ModuleToViewNotes = this.ModuloActivo();
        this.isLoading = false;

      },
      (error) => {
        this.errorManagement.showAlert( new Alert('error', 'Error al cargar los estudiantes') );
        this.isLoading = false;
      });
    });
  }

  selectActividad( id:number ){
    if(this.actividadIdToView === id){
      this.actividadIdToView = 0;
    }
    else{
      this.actividadIdToView = id;
    }
  }

  IsActivo = (Modulo:Module):boolean => {
    return Modulo.state.stateId === 2 || Modulo.state.stateId === 3;
  }

  ModuloActivo():Module {
    return this.Curso.modules.find( modulo => modulo.state.stateId === 2 || modulo.state.stateId === 3 )!;
  }

  ActividadToView = (Modulo:Module, activityId:number):Activity => {
    return Modulo.activities.find( activity => activity.activityId === activityId )!;
  }

  currentTotalScore = ( Module:Module ):number=>{
    return Module.activities.reduce( (total, activity) => total + activity.maxScore, 0 );
  }

  ordenarActividades = (activities:Activity[]):Activity[] => {
    return activities.sort( (a,b) => a.maxScore - b.maxScore );
  }

  openActivityModal(ModuleId: number, Activity?: Activity) {
    this.creatingInModal = ModuleId;

    if(Activity) {
      this.SelectedToEdit = Activity;
      this.isCreatingActivity = false;
    }
    else{
      this.isCreatingActivity = true;
    }

    this.isActivityFormModalOpen = true;
  }

  handleActivityModalClose() {
    this.isActivityFormModalOpen = false;  // Cerrar el modal desde el padre
  }

  handleCreated(event: { activityName: string; description: string; maxScore: number; deadline: Date }) {

    const DTO = {
      activityName: event.activityName,
      description: event.description,
      maxScore: event.maxScore,
      deadline: event.deadline,
      moduleId: this.creatingInModal,
    };
    const module = this.Curso.modules.find(modulo => modulo.moduleId == this.creatingInModal);

    console.log(this.isCreatingActivity);
    console.log('Actividad creada:', DTO);

    if (module && this.isCreatingActivity) {
      this.activityRepository.Create(DTO).subscribe(
        data => {
          module.activities.push(data);
          this.errorManagement.showAlert( new Alert('success', 'Actividad creada exitosamente') );
        },
        error => {
          this.errorManagement.showAlert( new Alert('error', 'Error al crear la actividad') );
        }
      );
    } else if(module && !this.isCreatingActivity){
      this.activityRepository.Edit( this.SelectedToEdit.activityId, DTO ).subscribe(
        data => {
          const index = module.activities.findIndex( activity => activity.activityId === data.activityId );
          module.activities[index] = data;
          this.errorManagement.showAlert( new Alert('success', 'Actividad actualizada exitosamente') );
        },
        error => {
          this.errorManagement.showAlert( new Alert('error', 'Error al crear la actividad') );
        }
      );
    } else {
    }

    this.creatingInModal = 0;
  }

  SolicitarAprobacion = () => {
    this.courseRepository.SolicitarAprobacion( this.courseId ).subscribe(
      () => {
        this.CargarData();
        this.errorManagement.showAlert( new Alert('success', 'Solicitud de aprobación enviada') );
      },
      (error) => {
        this.errorManagement.showAlert( new Alert('error', 'Error al solicitar aprobación') );
      }
    )
  }

  EliminarActividad = () => {
    if(this.activityToDelete == 0){
      return;
    }
    this.activityRepository.Delete( this.activityToDelete ).subscribe(
      () => {
        this.CargarData();
        this.errorManagement.showAlert( new Alert('success', 'Actividad eliminada exitosamente') );
      },
      (error) => {
        this.errorManagement.showAlert( new Alert('error', 'Error al eliminar la actividad') );
      }
    )
  }

  nextModulo(){
    let index = this.Curso.modules.indexOf(this.ModuleToViewNotes) + 1;

    this.ModuleToViewNotes = this.Curso.modules[index];
  }

  prevModulo(){
    let index = this.Curso.modules.indexOf(this.ModuleToViewNotes) - 1;
    this.ModuleToViewNotes = this.Curso.modules[index];
  }
}
