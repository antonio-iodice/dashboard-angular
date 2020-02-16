import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  dateStart: Date;
  dateEnd: Date;

  constructor(private dataService: DataService) { 
    this.dateEnd = dataService.dateEnd.value;
    this.dateStart = dataService.dateStart.value;
  }

  ngOnInit(): void {
  }

  valueStartChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateStart = event.value;
    this.dataService.dateStart.next(event.value);
  }

  valueEndChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateEnd = event.value;
    this.dataService.dateEnd.next(event.value);
  }

}
