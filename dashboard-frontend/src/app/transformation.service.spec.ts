import { TestBed } from '@angular/core/testing';

import { TransformationService } from './transformation.service';
import { DatePipe } from '@angular/common';

describe('TransformationService', () => {
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
  let service: TransformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatePipe
      ],
    }).compileComponents();

    service = TestBed.get(TransformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should group by correct values', () => {
    const transformedData = service.groupBy(exampleData, 'country');
    expect(transformedData.ITA.length).toEqual(2);
    expect(transformedData.ENG.length).toEqual(1);
    expect(transformedData.ENG[0].id).toEqual(3);
  });

  it('should transform date to correct label', () => {
    const january2020 = new Date('01-01-2020');
    const february2019 = new Date('02-02-2019');
    const december2018 = new Date('2020-12-10T00:00:00.000Z');
    expect(service.fromDateToMonthLabel(january2020)).toEqual('01-2020');
    expect(service.fromDateToMonthLabel(february2019)).toEqual('02-2019');
    expect(service.fromDateToMonthLabel(december2018)).toEqual('12-2020');
  });

  it('should generate date labels for interval', () => {
    const january2020 = new Date('01-01-2020');
    const april2020 = new Date('04-01-2020');
    const result1 = service.createMonthlyLabelsFromInterval(january2020, april2020);
    expect(result1).toEqual(['01-2020', '02-2020', '03-2020', '04-2020']);
    const february2019 = new Date('02-01-2019');
    const april2019 = new Date('04-10-2019');
    const result2 = service.createMonthlyLabelsFromInterval(february2019, april2019);
    expect(result2).toEqual(['02-2019', '03-2019', '04-2019']);
    const november2019 = new Date('11-01-2019');
    const february2020 = new Date('02-02-2020');
    const result3 = service.createMonthlyLabelsFromInterval(november2019, february2020);
    expect(result3).toEqual(['11-2019', '12-2019', '01-2020', '02-2020']);
  })
});
