import { Student } from './../model/Student.model';
import { Component, Input } from '@angular/core';
import { Course, Module } from '../model/Course.model';
import { Grade } from '../model/Grade.model';

@Component({
  selector: 'boleta-evaluacion',
  templateUrl: './boleta-evaluacion.component.html',
  styleUrl: './boleta-evaluacion.component.scss'
})
export class BoletaEvaluacionComponent {

  @Input() Cursos!:Course[];
  @Input() Grados!:Grade[];
  @Input() Student!:Student;

  constructor() { }

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

  getTotalGeneral = (): string => { // Asegúrate de que el retorno sea un string
    let total = 0;
    let index = 0;

    this.Cursos.forEach((course) => {
      const courseTotal = parseFloat(this.getTotalByCourse(course)); // Convierte a número para sumar
      total += courseTotal; // Sumar el total del curso
      if (courseTotal > 0) index++;
    });

    return (index > 0) ? (total / index).toFixed(2) : '0.00'; // Retorna el promedio general como string con dos decimales
  }

}
