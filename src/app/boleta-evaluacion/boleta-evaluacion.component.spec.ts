import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaEvaluacionComponent } from './boleta-evaluacion.component';

describe('BoletaEvaluacionComponent', () => {
  let component: BoletaEvaluacionComponent;
  let fixture: ComponentFixture<BoletaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoletaEvaluacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoletaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
