import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StagingAreaComponent } from './staging-area.component';

describe('StagingAreaComponent', () => {
  let component: StagingAreaComponent;
  let fixture: ComponentFixture<StagingAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StagingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StagingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
