import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../../../model/Activity.Model';

@Component({
  selector: 'activity-form',
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.scss'
})

export class ActivityFormComponent {
  @Input() isOpen = false;
  @Input() isCreate = false;
  @Input() Activity!: Activity;
  @Output() modalClose = new EventEmitter<void>();
  @Output() Created = new EventEmitter<{
    activityName: string;
    description: string;
    maxScore: number;
    deadline: Date;
  }>();

  Form!: FormGroup;

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.initializeForm();
  }

  // Método para inicializar el formulario
  private initializeForm() {
    this.Form = this.fb.group({
      activityName: ['', Validators.required],
      description: [''],
      maxScore: ['', Validators.required],
      deadline: ['', [Validators.required]],
    });
  }

  closeModal() {
    this.isOpen = false;
    this.modalClose.emit();  // Emitir el evento al cerrar el modal
  }

  create() {
    if (this.Form.valid) {
      const formValues = this.Form.value;

      this.Created.emit({
        activityName: formValues.activityName,
        description: formValues.description,
        maxScore: Number(formValues.maxScore),
        deadline: new Date(formValues.deadline), // Convierte el string a Date
      });

      this.closeModal();  // Cerrar el modal después de enviar los datos
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Activity'] && this.Activity) {
      this.updateFormWithActivityData();
    }
  }

  private updateFormWithActivityData() {
    if (this.Activity) {
      const formattedDate = this.datePipe.transform(this.Activity.deadline, 'yyyy-MM-dd');

      this.Form.patchValue({
        activityName: this.Activity.activityName,
        description: this.Activity.description,
        maxScore: this.Activity.maxScore,
        deadline: formattedDate,
      });
    }
  }
}
