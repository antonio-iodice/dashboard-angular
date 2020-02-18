import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ObjectUnsubscribedError } from 'rxjs';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {

  pieChartLabels = [];
  pieChartData = [];
  pieChartType = 'pie';
  pieChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.initPieChart();
  }

  private initPieChart() {
    this.dataService.filteredValues.pipe(
      map(data => {
        return this.groupBy(data, "country");
      })
    ).subscribe(data => {
      const labels = [];
      const newData = [];
      this.pieChartLabels.length = 0;
      this.pieChartData.length = 0;
      Object.keys(data).forEach(key => {
        labels.push(key);
        newData.push(data[key].length);
      });
      this.pieChartLabels = labels;
      this.pieChartData = newData;
    })
  }

  private groupBy(items, key) {
    return items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item]
      }),
      {});
  }


}
