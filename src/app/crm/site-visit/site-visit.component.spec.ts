import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitComponent } from './site-visit.component';

describe('SiteVisitComponent', () => {
  let component: SiteVisitComponent;
  let fixture: ComponentFixture<SiteVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
