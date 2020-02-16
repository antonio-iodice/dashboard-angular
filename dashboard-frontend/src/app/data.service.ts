import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap, scan, map } from 'rxjs/operators';
import { merge } from 'rxjs';

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

  currentData: Observable<any>;
  allData: Observable<any>;
  updates = this.socket.fromEvent<InsertEvent>('update');

  constructor(
    private apiService: ApiService,
    private socket: Socket
    ) {
    this.init(socket);
  }

  private init(socket: Socket) {
    this.currentData = this.apiService.getApi(ENDPOINT);
    this.currentData.subscribe(x => {
      console.log(x);
      socket.emit('ready for data', 'READY');
    })

    const updatesCorrected = this.updates.pipe(
      map(update => {
        return JSON.parse(update.message.payload);
      })
    )
    this.updates.subscribe(x => console.log(x));

    this.allData = merge(this.currentData, updatesCorrected).pipe(
      scan((acc, curr) => { return [...acc, curr] })
    );
  }

}
