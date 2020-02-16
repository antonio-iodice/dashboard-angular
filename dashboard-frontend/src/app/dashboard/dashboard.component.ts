import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataPoints: Observable<any>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log('init?');
    this.dataPoints = this.dataService.allData;

    this.dataService.updates.subscribe(result => {
      console.log(result);
      alert(result);
    })
  }

}
