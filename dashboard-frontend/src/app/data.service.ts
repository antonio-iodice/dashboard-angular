import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/internal/Observable';
import { scan, map } from 'rxjs/operators';
import { merge, BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';

const ENDPOINT = `${environment.endpoint}/api/download`;

interface InsertEvent {
  message: {
    payload: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dateStart = new ReplaySubject<Date>(1);
  dateEnd = new ReplaySubject<Date>(1);

  currentData: Observable<any>;
  updates = this.socket.fromEvent<InsertEvent>('update');
  private filteredValues: Observable<any>;

  constructor(
    private apiService: ApiService,
    private socket: Socket
    ) {
    this.init(socket);
  }

  private init(socket: Socket) {
    this.createDefaultFilterDates();
    this.setUpSocket(socket);
    this.setUpFilters();
  }

  private createDefaultFilterDates() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);

    this.dateStart.next(start);
    this.dateEnd.next(end);
  }

  private setUpSocket(socket: Socket) {
    this.currentData = this.apiService.getApi(ENDPOINT);
    this.currentData.subscribe(x => {
      socket.emit('ready for data', 'READY');
    });
  }

  private setUpFilters() {
    const mappedUpdates = this.updates.pipe(map(update => {
      return JSON.parse(update.message.payload);
    }));
    const mergedData = merge(this.currentData, mappedUpdates).pipe(
      scan((acc, curr) => { 
        return [...acc, curr]; 
      }));

    this.filteredValues = this.createFilteredValues(mergedData);
  }

  private createFilteredValues(mergedData: Observable<any>) {
    return combineLatest(
      this.dateStart,
      this.dateEnd,
      mergedData
    ).pipe(
      map(([start, end, data]) => {
        return data.filter(item => {
          return new Date(item.downloaded_at) >= start && new Date(item.downloaded_at) <= end;
        })
      })
    );
  }

  getFilteredValues(): Observable<any> {
    return this.filteredValues;
  }

}
