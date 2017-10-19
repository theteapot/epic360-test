import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentItemsComponent } from './current-items.component';

describe('CurrentItemsComponent', () => {
  let component: CurrentItemsComponent;
  let fixture: ComponentFixture<CurrentItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
