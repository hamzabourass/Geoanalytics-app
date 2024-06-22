import { Component, OnInit } from '@angular/core';
import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: EsriMap;
  mapView!: MapView;

  constructor() {
    this.map = new EsriMap({
      basemap: 'streets'
    });
  }

  ngOnInit(): void {
    this.mapView = new MapView({
      container: 'mapViewDiv',
      map: this.map,
      center: [-6.78035, 34.09687],
      zoom: 13
    });
  }

  selectedBasemap: string = 'streets';
  basemaps = [
    { name: 'Streets', value: 'streets' },
    { name: 'Topographic', value: 'topo' },
    { name: 'Imagery', value: 'satellite' },
    { name: 'Dark Gray Canvas', value: 'dark-gray' },
    { name: 'Light Gray Canvas', value: 'gray' }
  ];

  onBasemapChange() {
    this.map.basemap = this.selectedBasemap;
  }


}
