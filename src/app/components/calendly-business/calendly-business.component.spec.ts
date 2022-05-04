import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendlyBusinessComponent } from './calendly-business.component';

describe('CalendlyBusinessComponent', () => {
  let component: CalendlyBusinessComponent;
  let fixture: ComponentFixture<CalendlyBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendlyBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendlyBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
