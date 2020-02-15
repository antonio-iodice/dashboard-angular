import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log('init?');
    this.dataService.updates.subscribe(result => {
      console.log(result);
      alert(result);
    })
  }

}
