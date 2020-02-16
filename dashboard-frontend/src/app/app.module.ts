import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from './../environments/environment.prod';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { MapComponent } from './map/map.component';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { CounterComponent } from './counter/counter.component';

const config: SocketIoConfig = { url: environment.endpoint, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MapComponent,
    CounterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
	  SocketIoModule.forRoot(config)
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
