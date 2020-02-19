import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterComponent } from './counter.component';
import { DataService } from '../data.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  // const dataServiceSpy = jasmine.createSpyObj('ApiService', {
  //   getApi: of({list: []}),
  //   putApi: of(),
  //   deleteApi: of()
  // });

  const dataServiceSpy = jasmine.createSpyObj('DataService', {
    getFilteredValues: of([
      {'appId': 'APP_ID'},
      {'appId': 'APP_ID'}
    ])
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterComponent ],
      providers: [
        { provide: DataService, useValue: dataServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display counter', () => {
    const counter = fixture.debugElement.query(By.css('#counter'));
    expect(counter.nativeElement.textContent.trim()).toBe('2');
  })
});
