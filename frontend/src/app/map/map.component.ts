import {Component, OnInit} from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import {MapService} from "../services/map.service";
import {NearbyStationsDialogComponent} from "../nearby-stations-dialog/nearby-stations-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {provincesData} from "../data/provincesData";

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
  selectedProvinceId: number | null = null;
  searchKey: any;

  constructor(private mapService: MapService,private dialog: MatDialog) {}

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
      // Assuming your GeoJSON URL for provinces is known and provided here
      const geoJsonUrl = 'assets/provinces.geojson';
      this.mapService.displayGeoJSON(geoJsonUrl);
      this.mapService.displayProvinceByObjectId(this.selectedProvinceId);
    }
    else{
      this.mapService.displayProvinceByObjectId(null);

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

  search(): void {
    if (this.searchKey.trim() !== '') {
      this.mapService.clearStations();
      this.mapService.searchStations(this.searchKey.trim());
    } else {
      this.mapService.clearStations();
      this.stationsLoaded = false;
    }
  }
}
