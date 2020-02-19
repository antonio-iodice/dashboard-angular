import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { DataService } from './data.service';
import { of, Subject, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';
import { Socket } from 'ngx-socket-io';
import { take } from 'rxjs/operators';

describe('DataService', () => {
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
    "downloaded_at": '2020-12-10T00:00:00.000Z'
  }];
  let service: DataService;

  const apiServiceSpy = jasmine.createSpyObj('ApiService', {
    getApi: of(exampleData)
  });

  const event = new ReplaySubject<any>(1);
  const socketSpy = jasmine.createSpyObj('Socket', {
    fromEvent: event,
    emit: null
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Socket, useValue: socketSpy }
      ],
    }).compileComponents();

    service = TestBed.get(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create socket event', () => {
    expect(service.updates).toEqual(event);
  });

  it('should create current data', (done) => {
    service.currentData.subscribe((data) => {
      expect(data).toEqual(exampleData);
      done();
    });
  });

  it('filtered data should contain data', (done) => {
    service = TestBed.get(DataService);
    service.dateStart.next(new Date('2020-11-10T00:00:00.000Z'));
    service.dateEnd.next(new Date('2021-01-10T00:00:00.000Z'));
    service.getFilteredValues().subscribe((data) => {
      expect(data.map(item => item.id)).toContain(1);
      expect(data.map(item => item.id)).toContain(2);
      expect(data.map(item => item.id)).toContain(3);
      done();
    })
  });

  it('filtered data should contain nothing applying filters', (done) => {
    service.dateStart.next(new Date('2019-11-10T00:00:00.000Z'));
    service.dateEnd.next(new Date('2020-01-10T00:00:00.000Z'));
    service.getFilteredValues().subscribe((data) => {
      expect(data).toEqual([]);
      done();
    })
  });

  it('filtered data should contain updated data', (done) => {
    service = TestBed.get(DataService);
    service.dateStart.next(new Date('2020-11-10T00:00:00.000Z'));
    service.dateEnd.next(new Date('2021-01-10T00:00:00.000Z'));
    const newData = {
      "id": 4,
      "latitude": "9,185924",
      "longitude": "45,4654219",
      "app_id": "APP_ID",
      "country": "ENG",
      "downloaded_at": '2020-12-10T00:00:00.000Z'
    };
    const message = {
      message: {
        payload: JSON.stringify(newData)
      }
    }
    event.next(message);
    const oldPlusNewData = [...exampleData, newData];
    let i = 0;
    service.getFilteredValues().subscribe((data) => {
      console.log('NEW');
      console.log(data);
      console.log('OLD + NEW');
      console.log(oldPlusNewData);
      console.log(data.length);
      console.log(data.length - i);
      const length = data.length - i;
      expect(length).toBe(3); // first = 3, then = 4
      i++;
      console.log(i);
      
    });
    done();
  });
});
