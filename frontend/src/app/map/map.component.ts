import {Component, OnInit} from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import {MapService} from "../services/map.service";
import {NearbyStationsDialogComponent} from "../nearby-stations-dialog/nearby-stations-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
  stationsLoaded: boolean = false;
  nearbyStationsLoaded: boolean = false;

  constructor(private mapService: MapService,private dialog: MatDialog) {}

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
    this.mapService.displayGeoJSON(selectedGeoJSON);

  }


  loadStations(): void {
    if (this.stationsLoaded) {

      this.mapService.clearStations();
      this.stationsLoaded = false;

    } else {

      this.mapService.displayStations();
      this.stationsLoaded = true;

    }
  }

  openNearbyStationsDialog(): void {
    const dialogRef = this.dialog.open(NearbyStationsDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { latitude, longitude, distance } = result;
        this.mapService.clearStations();
        this.mapService.loadNearbyStations(latitude, longitude, distance);
        this.nearbyStationsLoaded = true;
      }
    });
  }


  clearWithinStations(){
    this.mapService.clearWithinStations();
    this.nearbyStationsLoaded = false;
  }

  clearStations() {
    this.mapService.clearStations();
    this.stationsLoaded= true;
  }
}
