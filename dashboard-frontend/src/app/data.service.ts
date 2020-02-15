import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  updates = this.socket.fromEvent<Document>('update');

  constructor(private socket: Socket) { 
    socket.emit('ready for data', 'READY');
  }

}
