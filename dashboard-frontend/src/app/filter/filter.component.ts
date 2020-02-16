import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { takeLast, take } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  dateStart: Date;
  dateEnd: Date;
  minDate: Date;
  maxDate: Date;

  constructor(private dataService: DataService) { 
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 5, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    this.dataService.dateStart.pipe(take(1)).subscribe(date => {
      this.dateStart = date;
    });

    this.dataService.dateEnd.pipe(take(1)).subscribe(date => {
      this.dateEnd = date;
    });
  }

  valueStartChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value < this.maxDate && event.value >= this.minDate) {
      this.dateStart = event.value;
      this.dataService.dateStart.next(event.value);
    }
  }

  valueEndChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value < this.maxDate && event.value >= this.minDate) {
      this.dateEnd = event.value;
      this.dataService.dateEnd.next(event.value);
    }
  }

}
