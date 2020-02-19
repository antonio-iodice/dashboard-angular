import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ObjectUnsubscribedError } from 'rxjs';
import { TransformationService } from '../transformation.service';

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

  constructor(
    private dataService: DataService,
    private transformationService: TransformationService
  ) { }

  ngOnInit() {
    this.initPieChart();
  }

  private initPieChart() {
    this.dataService.getFilteredValues().pipe(
      map(data => {
        return this.transformationService.groupBy(data, "country");
      })
    ).subscribe(data => {
      this.createPieChartParametersFrom(data);
    })
  }

  createPieChartParametersFrom(data: any) {
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
  }
}
