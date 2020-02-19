import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieComponent } from './pie.component';
import { DataService } from '../data.service';
import { of } from 'rxjs';
import { TransformationService } from '../transformation.service';
import { DatePipe } from '@angular/common';

describe('PieComponent', () => {
  let component: PieComponent;
  let fixture: ComponentFixture<PieComponent>;

  const exampleData = [{
    "id": 1,
    "latitude":"9,1859243",
    "longitude":"45,4654219",
    "app_id":"appId",
    "country":"ITA",
    "downloaded_at":"2020-12-10T00:00:00.000Z"
  },{
    "id": 2,
    "latitude": "9,1859243",
    "longitude": "45,4654219",
    "app_id": "appId",
    "country": "ITA",
    "downloaded_at": "2020-12-10T00:00:00.000Z"
  },{
    "id": 3,
    "title":null,
    "latitude": "9,185924",
    "longitude": "45,4654219",
    "app_id": "APP_ID",
    "country": "ENG",
    "downloaded_at": null
  }];

  const dataService = jasmine.createSpyObj('DataService', {
    getFilteredValues: of(exampleData)
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieComponent ],
      providers: [
        { provide: DataService, useValue: dataService },
        TransformationService,
        DatePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create correct data', () => {
    expect(component.pieChartLabels.length).toBe(2);
    expect(component.pieChartLabels).toEqual(['ITA', 'ENG']);
    expect(component.pieChartData).toEqual([2, 1]);
  })

  it('should generate correct pie chart data', () => {
    const groupedData = {
      'ITA': [{}, {}],
      'ENG': [{}]
    }
    component.createPieChartParametersFrom(groupedData);
    fixture.detectChanges();
    expect(component.pieChartLabels.length).toBe(2);
    expect(component.pieChartLabels).toEqual(['ITA', 'ENG']);
    expect(component.pieChartData).toEqual([2, 1]);
  });
});
