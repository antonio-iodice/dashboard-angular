import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { AppComponent } from './app.component';

describe('ApiService', () => {

  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ ApiService
      ],
    }).compileComponents();

    service = TestBed.get(ApiService);
    httpMock = TestBed.get(HttpTestingController);

  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform get calls', () => {
    const endpoint = `/api/download.json`;
    service.getApi(endpoint).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(endpoint);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush({});
  });

  it('should perform post calls', () => {
    const endpoint = `/download/me.json`;
    service.postApi(endpoint, {}).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(endpoint);
    expect(httpRequest.request.method).toBe('POST');
    httpRequest.flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });

});
