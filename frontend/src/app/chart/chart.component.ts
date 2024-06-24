import {ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {TransportStationService} from "../services/transport-station.service";
import {stationTypeData} from "../data/stationTypeData";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [CanvasJSAngularChartsModule],
})
export class ChartComponent  {
  @Input() chartData: number[] = [];

  chartOptions: any = {};

  stationTypeData: { name: string, code: number | null }[] = stationTypeData;

  constructor(private cdr: ChangeDetectorRef) {}



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      this.updateChart(this.chartData);
    }
  }

  // Update chart with station counts
  updateChart(counts: number[]): void {
    this.chartOptions = {
      title: {
        text: "Number of Stations by Type"
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        title: "Number of Stations"
      },
      data: [{
        type: "bar",
        indexLabel: "{y}",
        yValueFormatString: "#,###",
        dataPoints: this.stationTypeData.map((item, index) => ({
          label: item.name,
          y: counts[index] || 0
        }))
      }]
    };
    this.cdr.detectChanges();


  }

  clearChart(): void {
    this.chartOptions = {
      title: {
        text: "Number of Stations by Type"
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        title: "Number of Stations"
      },
      data: [{
        type: "bar",
        indexLabel: "{y}",
        yValueFormatString: "#,###",
        dataPoints: []
      }]
    };
  }

  }
