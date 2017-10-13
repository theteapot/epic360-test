import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSchedulerComponent } from './staff-scheduler.component';

describe('StaffSchedulerComponent', () => {
  let component: StaffSchedulerComponent;
  let fixture: ComponentFixture<StaffSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
