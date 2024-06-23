import {Component, OnInit} from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import {MapService} from "../services/map.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapView!: MapView;
  graphicsLayer!: GraphicsLayer;
  pointLayer!: FeatureLayer;
  lineLayer!: FeatureLayer;
  polygonLayer!: FeatureLayer;
  basemaps = [
    { name: 'Streets', value: 'streets' },
    { name: 'Topographic', value: 'topo' },
    { name: 'Imagery', value: 'satellite' },
    { name: 'Dark Gray Canvas', value: 'dark-gray' },
    { name: 'Light Gray Canvas', value: 'gray' }
  ];
  selectedBasemap: string = 'streets';
  isLoading: boolean = true;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.graphicsLayer = this.mapService.getGraphicsLayer();
    this.pointLayer = this.mapService.getPointLayer();
    this.lineLayer = this.mapService.getLineLayer();
    this.polygonLayer = this.mapService.getPolygonLayer();
    this.mapView = this.mapService.initializeMapView('mapViewDiv');

    this.mapView.when(() => {
      this.initializeEditor();
      this.isLoading = false;
    }, (error: any) => {
      console.error('Error loading map:', error);
      this.isLoading = false;
    });
  }

  onBasemapChange(): void {
    this.isLoading = true;
    this.mapService.changeBasemap(this.selectedBasemap);
    this.mapView.when(() => {
      this.isLoading = false;
    }, (error: any) => {
      console.error('Error changing basemap:', error);
      this.isLoading = false;
    });
  }

  initializeEditor(): void {
    this.mapService.initializeEditor(this.mapView);
  }

  onGeoJSONSelect(event: any): void {
    const selectedGeoJSON = event.value;
    if (selectedGeoJSON) {
      this.mapService.displayGeoJSON(selectedGeoJSON);
    }
  }

}
