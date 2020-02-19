import { TransformationService } from "./../transformation.service";
import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { Observable } from "rxjs/internal/Observable";
import { DatePipe } from "@angular/common";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"]
})
export class ChartComponent implements OnInit {
  dataPoints: Observable<any>;

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels = [];
  barChartType = "line";
  barChartLegend = true;
  barChartData = [];

  constructor(
    private dataService: DataService,
    private transformationService: TransformationService
  ) {}

  ngOnInit(): void {
    this.createChartLabelsAndData();
  }

  createChartLabelsAndData() {
    combineLatest(
      this.dataService.dateStart,
      this.dataService.dateEnd
    ).subscribe(([start, end]) => {
      const labels = this.transformationService.createMonthlyLabelsFromInterval(
        start,
        end
      );
      this.barChartLabels.length = 0;
      this.barChartLabels.push(...labels);
      this.createChartData();
    });
  }

  createChartData() {
    this.dataPoints = this.dataService.getFilteredValues();
    this.dataPoints
      .pipe(
        map(data => {
          return this.addDateLabel(data);
        }),
        map(data => {
          return this.transformToFormatSuitableForChart(data);
        })
      )
      .subscribe(info => {
        this.populateChartData(info);
      });
  }

  private transformToFormatSuitableForChart(data: any) {
    const groupedByAppId = this.groupByAppId(data);
    const groupedByDateLabel = this.groupByDateLabel(groupedByAppId);
    return groupedByDateLabel;
  }

  private addDateLabel(data) {
    return data.map(item => {
      item.dateLabel = this.transformationService.fromDateToMonthLabel(
        item.downloaded_at
      );
      return item;
    });
  }

  private groupByAppId(data) {
    const groupedByAppId = this.transformationService.groupBy(data, "app_id");
    const result = [];
    Object.keys(groupedByAppId).forEach(k => {
      result.push({ key: k, values: groupedByAppId[k] });
    });
    return result;
  }

  private groupByDateLabel(data) {
    const result = data.map(item => {
      item.values = this.transformationService.groupBy(
        item.values,
        "dateLabel"
      );
      return item;
    });
    return result;
  }

  private populateChartData(info) {
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
}
