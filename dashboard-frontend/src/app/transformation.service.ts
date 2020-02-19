import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

const DATE_FORMAT = 'MM-yyyy'

@Injectable({
  providedIn: 'root'
})
export class TransformationService {

  constructor(
    private datePipe: DatePipe
  ) { }

  createMonthlyLabelsFromInterval(start, end): string[] {
    const labels = [];
      let current = new Date(start);
      do {
        const label = this.fromDateToMonthLabel(current);
        labels.push(label);
        current.setMonth(current.getMonth() + 1);
      } while (current.getFullYear() < end.getFullYear() || current.getMonth() < end.getMonth());
      labels.push(this.fromDateToMonthLabel(end));
      return labels;
  }

  fromDateToMonthLabel(date: Date): string {
    return this.datePipe.transform(date, "MM-yyyy");
  }

  groupBy(items, key) {
    return items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item]
      }),
      {}
    );
  }
}
