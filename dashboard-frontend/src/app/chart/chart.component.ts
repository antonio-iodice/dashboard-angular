import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/internal/Observable';
import { DatePipe } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"]
})
export class ChartComponent implements OnInit {
  dataPoints: Observable<any>;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = [];
  public barChartType = "line";
  public barChartLegend = true;
  public barChartData = [];

  constructor(
    private dataService: DataService, 
    private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.createChartLabelsAndThenInit();
  }

  createChartLabelsAndThenInit() {
    combineLatest(
      this.dataService.dateStart,
      this.dataService.dateEnd
    ).subscribe(([start, end]) => {
      const labels = [];
      let current = new Date(start);
      do {
        const label = this.datePipe.transform(current, "MM-yyyy");
        labels.push(label);
        current.setMonth(current.getMonth() + 1);
      } while (current < end);
      labels.push(this.datePipe.transform(end, "MM-yyyy"));
      this.barChartLabels.length = 0;
      this.barChartLabels.push(...labels);
      this.init();
    });
  }

  init() {
    this.dataPoints = this.dataService.filteredValues;
    this.dataPoints
      .pipe(
        map(data => this.addDataLabel(data)),
        map(data => {
          const groupedByAppId = this.groupByAppId(data);
          const groupedByDateLabel = this.groupByDateLabel(groupedByAppId);
          return groupedByDateLabel;
        })
      )
      .subscribe(info => {
        this.createChartDataFrom(info);
      });
  }

  addDataLabel(data) {
    return data.map(item => {
      item.dateLabel = this.datePipe.transform(item.downloaded_at, "MM-yyyy");
      return item;
    });
  }

  groupByAppId(data) {
    const groupedByAppId = this.groupBy(data, "app_id");
    const result = [];
    Object.keys(groupedByAppId).forEach(k => {
      result.push({ key: k, values: groupedByAppId[k] });
    });
    return result;
  }

  groupByDateLabel(data) {
    const result = data.map(item => {
      item.values = this.groupBy(item.values, "dateLabel");
      return item;
    });
    return result;
  }

  createChartDataFrom(info) {
    this.barChartData = [];
    info.forEach(infoItem => {
      const singleData = { data: [], label: "" };
      singleData.label = infoItem.key;
      this.barChartLabels.forEach(chartLabel => {
        singleData.data.push(infoItem.values[chartLabel]?.length || 0);
      });
      this.barChartData.push(singleData);
    });
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
