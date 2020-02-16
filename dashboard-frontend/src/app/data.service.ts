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
  allData: Observable<any>;
  filteredValues: Observable<any>;
  updates = this.socket.fromEvent<InsertEvent>('update');

  constructor(
    private apiService: ApiService,
    private socket: Socket
    ) {
    this.init(socket);
  }

  private init(socket: Socket) {
    this.createFilterDates();
    const updatesCorrected = this.setUpSocket(socket);
    this.setUpFilters(updatesCorrected);
  }

  private createFilterDates() {
    this.dateEnd.next(new Date());
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    this.dateStart.next(start);
  }

  private setUpFilters(updatesCorrected: Observable<any>) {
    this.allData = merge(this.currentData, updatesCorrected).pipe(scan((acc, curr) => { return [...acc, curr]; }));
    this.filteredValues = this.getFilteredValues();
  }

  private setUpSocket(socket: Socket) {
    this.currentData = this.apiService.getApi(ENDPOINT);
    this.currentData.subscribe(x => {
      socket.emit('ready for data', 'READY');
    });

    this.updates.subscribe(x => console.log(x)); // TO BE REMOVED: Only for debugging
    return this.updates.pipe(map(update => {
      return JSON.parse(update.message.payload);
    }));
  }

  private getFilteredValues() {
    return combineLatest(
      this.dateStart,
      this.dateEnd,
      this.allData
    ).pipe(
      map(([start, end, data]) => {
        return data.filter(item => {
          return new Date(item.downloaded_at) >= start && new Date(item.downloaded_at) <= end;
        })
      })
    );
  }

}
