import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { of } from 'rxjs';
import { TransformationService } from '../transformation.service';
import { DataService } from '../data.service';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  const exampleData = [{
    "id": 1,
    "latitude":"9,1859243",
    "longitude":"45,4654219",
    "app_id":"appId",
    "country":"ITA",
    "downloaded_at":"2019-12-10T00:00:00.000Z"
  },{
    "id": 2,
    "latitude": "9,1859243",
    "longitude": "45,4654219",
    "app_id": "appId",
    "country": "ITA",
    "downloaded_at": "2019-12-10T00:00:00.000Z"
  },{
    "id": 3,
    "title":null,
    "latitude": "9,185924",
    "longitude": "45,4654219",
    "app_id": "APP_ID",
    "country": "ENG",
    "downloaded_at": '2019-11-10T00:00:00.000Z'
  }];

  const dataServiceMock = {
    getFilteredValues: () => of(exampleData),
    dateStart: of(new Date('2019-11-10T00:00:00.000Z')),
    dateEnd: of(new Date('2020-01-10T00:00:00.000Z'))
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartComponent ],
      providers: [
        TransformationService,
        DatePipe,
        { provide: DataService, useValue: dataServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show chart', () => {
    fixture.detectChanges();
    const chart = fixture.debugElement.query(By.css('canvas'));
    expect(chart).toBeTruthy();
  });

  it('should have correct labels', () => {
    expect(component.barChartLabels).toEqual(['11-2019', '12-2019', '01-2020']);
  });

  it('should display correct data points', () => {
    expect(component.barChartData).toEqual([
      {
        data: [0, 2, 0],
        label: 'appId'
      }, {
        data: [1, 0, 0],
        label: 'APP_ID'
      }
    ]);
  });
});
