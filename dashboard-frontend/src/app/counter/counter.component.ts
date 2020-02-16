import { Observable } from 'rxjs/internal/Observable';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

  items: Observable<any[]>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.items = this.dataService.filteredValues;
  }

}
