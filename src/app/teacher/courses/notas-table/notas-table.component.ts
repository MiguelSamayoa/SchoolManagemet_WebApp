import { Component, Input } from '@angular/core';
import { Module } from '../../../model/Course.model';
import { Student } from '../../../model/Student.model';
import { StudentActivity } from '../../../model/Activity.Model';
import { ActivityRepositoryService } from '../../../Services/activity-repository.service';

@Component({
  selector: 'notas-table',
  templateUrl: './notas-table.component.html',
  styleUrls: ['./notas-table.component.scss']
})
export class NotasTableComponent {

  @Input() module!: Module;
  @Input() students!: Student[];

  constructor( private activityRepo:ActivityRepositoryService) {
  }

  getStudentScoreForActivity(studentActivities: StudentActivity[], activityId: number): number | null {
    const studentActivity = studentActivities.find(sa => sa.activityId === activityId);
    return studentActivity ? studentActivity.score : null;
  }

  getMax(): number {
    return this.module.activities.reduce((acc, a) => acc + a.maxScore, 0);
  }

  // Método para calcular el puntaje total
  calculateTotalScore(actividades: StudentActivity[]): number {
    if (!this.module || !this.module.activities || !Array.isArray(this.module.activities)) {
      return 0;
    }

    const actividadesFiltradas = actividades.filter(sa =>
      this.module.activities.some(activity => activity.activityId === sa.activityId)
    );

    return actividadesFiltradas.reduce((total, sa) => total + sa.score, 0);
  }

  updateScore(student: Student, activityId: number, event: Event) {
    // Hacer un cast a HTMLInputElement para acceder a la propiedad value
    const inputElement = event.target as HTMLInputElement;

    let activity =this.module.activities.find(a => a.activityId === activityId)
    if (!activity) {
      return; // No hacemos nada si el id de actividad no es válido
    }

    const newScore = +inputElement.value; // Convertir el valor a número
    const studentActivity = student.studentActivities.find(sa => sa.activityId === activityId);

    if( newScore > activity.maxScore || newScore < 0){
      console.log("El puntaje no es valido");
      inputElement.value = studentActivity?.score?.toString() || '';
    }
    else if(newScore === studentActivity?.score){
      console.log("El puntaje no ha cambiado");
    }
    else if(!studentActivity){
      this.activityRepo.RateStudentActivity(activityId, student.studentId, newScore).subscribe(
        data => {
          console.log(data);
          student.studentActivities.push(data);
        }
      );
    }
    else if (studentActivity && newScore !== studentActivity.score) {
      this.activityRepo.RateStudentActivity(activityId, student.studentId, newScore).subscribe(
        data => {
          console.log(data);
          studentActivity.score = data.score; // Actualizar el puntaje
        }
      );
    }

  }


}
