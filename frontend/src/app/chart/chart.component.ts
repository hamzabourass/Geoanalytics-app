import { Component, OnInit, Input } from '@angular/core';
import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() chartData: any;

  constructor() { }

  async ngOnInit() {
    const [Chart] = await loadModules(['@arcgis/core/widgets/Chart']);

    const chart = new Chart({
      container: 'chartDiv',
      data: this.chartData,
      type: 'bar',
      title: 'Station Data',
      xField: 'category',
      yField: 'value'
    });
  }
}
