import { Component } from '@angular/core';
import { Course, Module } from '../../../model/Course.model';
import { Student } from '../../../model/Student.model';
import { Activity } from '../../../model/Activity.Model';
import { ActivatedRoute } from '@angular/router';
import { CoursesRepositoryService } from '../../../Services/courses-repository.service';
import { StudentRepository } from '../../../Services/student-repository.service';
import { ActivityRepositoryService } from '../../../Services/activity-repository.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrl: './course-info.component.scss'
})
export class CourseInfoComponent {
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
    private activityRepository: ActivityRepositoryService
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
        console.log(error);
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

    if(Activity) this.SelectedToEdit = Activity;

    console.log( this.creatingInModal);
    console.log('Actividad seleccionada:', this.SelectedToEdit);
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

    console.log('Modulo:', module);
    console.log('Actividad creada:', DTO);

    // Asegurarse de que creatingInModal tenga un valor válido antes de continuar
    if (module && this.isCreatingActivity) {
      this.activityRepository.Create(DTO).subscribe(
        data => {
          module.activities.push(data);
        },
        error => {
          console.error('Error al crear la actividad:', error);
        }
      );
    } else if(module && !this.isCreatingActivity){
      this.activityRepository.Edit( this.SelectedToEdit.activityId, DTO ).subscribe(
        data => {
          const index = module.activities.findIndex( activity => activity.activityId === data.activityId );
          module.activities[index] = data;
        },
        error => {
          console.error('Error al editar la actividad:', error);
        }
      );
    } else {
      console.warn('No hay un módulo seleccionado para crear la actividad.');
    }

    this.creatingInModal = 0;
  }

  SolicitarAprobacion = () => {
    this.courseRepository.SolicitarAprobacion( this.courseId ).subscribe(
      () => {
        this.CargarData();
      },
      (error) => {
        console.log(error);
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
      },
      (error) => {
        console.log(error);
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

  SendToRevision( isAprobado:boolean ){
    this.courseRepository.SendToRevision( isAprobado, this.courseId ).subscribe(
      () => {
        this.CargarData();
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
