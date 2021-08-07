import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInscriptionBusinessComponent } from './form-inscription-business.component';

describe('FormInscriptionBusinessComponent', () => {
  let component: FormInscriptionBusinessComponent;
  let fixture: ComponentFixture<FormInscriptionBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInscriptionBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInscriptionBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
