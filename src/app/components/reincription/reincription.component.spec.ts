import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReincriptionComponent } from './reincription.component';

describe('ReincriptionComponent', () => {
  let component: ReincriptionComponent;
  let fixture: ComponentFixture<ReincriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReincriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReincriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
