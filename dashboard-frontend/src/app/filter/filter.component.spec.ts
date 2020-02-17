import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { DataService } from '../data.service';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  const dateStart = new BehaviorSubject(new Date());
  const dateEnd = new BehaviorSubject(new Date());
  const dataServiceSpy = {
    dateStart,
    dateEnd
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      providers: [
        { provide: DataService, useValue: dataServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
