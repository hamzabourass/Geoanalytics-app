import {Component, OnInit} from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import {MapService} from "../services/map.service";
import {NearbyStationsDialogComponent} from "../nearby-stations-dialog/nearby-stations-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {provincesData} from "../data/provincesData";
import {stationTypeData} from "../data/stationTypeData";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapView!: MapView;
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
  provinces: { id: number | null, name: string }[] = provincesData;
  stationTypes: { code: number | null, name: string }[] = stationTypeData;
  selectedProvinceId: number | null = null;
  searchKey: any;
  selectedStationCode: number | null = null;

  constructor(private mapService: MapService,private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.mapView = this.mapService.initializeMapView('mapViewDiv');
    this.mapView.when(() => {
      this.mapService.initializeEditor(this.mapView);
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

  onGeoJSONSelect(event: any): void {
    const selectedGeoJSON = event.value;
    this.mapService.displayGeoJSON(selectedGeoJSON);

  }

  onProvinceSelect(): void {
    if (this.selectedProvinceId !== null) {
      const geoJsonUrl = 'assets/provinces.geojson';
      this.mapService.displayGeoJSON(geoJsonUrl);
      this.mapService.displayProvinceByObjectId(this.selectedProvinceId);
    }
    else{
      this.mapService.displayProvinceByObjectId(null);
      this.mapService.displayGeoJSON(null);

    }
  }

  onStationTypeSelect(): void {
    if (this.selectedStationCode !== null) {
      this.mapService.clearStations();
      this.clearWithinStations();
      this.mapService.stationByCode(this.selectedStationCode);
      this.stationsLoaded = false;
    }
    else{
      this.mapService.clearStations();
    }
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
        this.mapService.loadNearbyStations(latitude, longitude, distance);
        this.nearbyStationsLoaded = true;
      }
    });
  }


  clearWithinStations(){
    this.mapService.clearWithinStations();
    this.nearbyStationsLoaded = false;
  }

  search(): void {
    if (this.searchKey.trim() !== '') {
      this.mapService.clearStations();
      this.clearWithinStations();
      this.mapService.searchStations(this.searchKey.trim());
      this.stationsLoaded = false;
    } else {
      this.mapService.clearStations();
    }
  }

  clearAll(): void {
    this.mapService.removeAll();
    this.mapView.graphics.removeAll();
    this.mapService.displayProvinceByObjectId(null);
    this.mapService.displayGeoJSON(null);
    this.stationsLoaded = false;
    this.nearbyStationsLoaded = false;
  }
}
