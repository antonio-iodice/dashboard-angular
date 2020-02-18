import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from './../environments/environment.prod';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { CounterComponent } from './counter/counter.component';
import { FilterComponent } from './filter/filter.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ChartComponent } from './chart/chart.component';
import { HeaderComponent } from './header/header.component';
import { PieComponent } from './pie/pie.component';

const config: SocketIoConfig = { url: environment.endpoint, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CounterComponent,
    FilterComponent,
    ChartComponent,
    HeaderComponent,
    PieComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
	  SocketIoModule.forRoot(config)
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
