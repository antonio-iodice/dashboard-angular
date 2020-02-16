import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/internal/Observable';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataPoints: Observable<any>;

  testData = [65, 59, 80, 81, 56, 55, 40];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['01-2020', '01-2020', '03-2020', '04-2020', 
  '05-2020', '06-2020', '07-2020', '08-2020',
  '09-2020', '10-2020', '11-2020', '12-2020'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [];

  constructor(
    private dataService: DataService,
    private datePipe: DatePipe
    ) { }

  
  ngOnInit(): void {
    this.dataPoints = this.dataService.allData;
    this.dataPoints.pipe(
      map(data => this.addDataLabel(data)),
      map(data => {
        const groupedByAppId = this.groupByAppId(data);
        const groupedByDateLabel = this.groupByDateLabel(groupedByAppId);
        return groupedByDateLabel;
      })
    ).subscribe(info => {
      this.createChartDataFrom(info);
    });

    this.dataService.updates.subscribe(result => {
      console.log(result);
    })

  }

  addDataLabel(data) {
    return data.map(item => {
      item.dateLabel = this.datePipe.transform(item.downloaded_at, 'MM-yyyy');
      return item;
    })
  }

  groupByAppId(data) {
    const groupedByAppId = this.groupBy(data, 'app_id');
    const result = [];
    Object.keys(groupedByAppId).forEach(k => {
      result.push({key: k, values: groupedByAppId[k]});
    });
    return result;
  }

  groupByDateLabel(data) {
    const result = data.map(item => {
      item.values = this.groupBy(item.values, 'dateLabel');
      return item;
    })
    return result;
  }

  createChartDataFrom(info) {
    console.log(info);
      this.barChartData = [];
      info.forEach(infoItem => {
        const singleData = {data: [], label: ''};
        singleData.label = infoItem.key;
        this.barChartLabels.forEach(chartLabel => {
          singleData.data.push(infoItem.values[chartLabel]?.length || 0);
        })
        this.barChartData.push(singleData);
      });
      console.log(this.barChartData);
  }

  groupBy(items, key) {
    return items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item,
        ],
      }), 
      {},
    );
  }



}
