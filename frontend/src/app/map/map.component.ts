import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import {MapService} from "../services/map.service";
import {NearbyStationsDialogComponent} from "../nearby-stations-dialog/nearby-stations-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {provincesData} from "../data/provincesData";
import {stationTypeData} from "../data/stationTypeData";
import {regionsData} from "../data/regionsData";
import {basemapsData} from "../data/baseMaps";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  mapView!: MapView;
  basemaps = basemapsData;
  selectedBasemap: string = 'streets';
  isLoading: boolean = true;
  stationsLoaded: boolean = false;
  nearbyStationsLoaded: boolean = false;
  searchedLoaded: boolean = false;
  byCodeLoaded: boolean = false;
  provinces: { id: number | null, name: string }[] = provincesData;
  regions: { id: number | null, name: string }[] = regionsData;
  stationTypes: { code: number | null, name: string }[] = stationTypeData;
  selectedProvinceId: number | null = null;
  selectedRegionId: number | null = null;
  searchKey: any;
  selectedStationCode: number | null = null;
  dataForChart: number[] = [];
  provinceStationsLoaded: boolean = false;
  regionStationsLoaded: boolean = false;

  constructor(private mapService: MapService,private dialog: MatDialog,private cdr: ChangeDetectorRef) {

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
      this.mapService.displayByObjectId(this.selectedProvinceId);
      this.provinceStationsLoaded = true;
      this.regionStationsLoaded = false;
      this.byCodeLoaded= false;
      this.stationsLoaded = false;
      this.nearbyStationsLoaded =false;
      this.searchedLoaded= false;
      this.mapService.fetchStationsWithinPolygon(this.selectedProvinceId).subscribe(stations => {
        this.dataForChart = this.mapService.countStationsByType(stations);
        console.log('Stations loaded, dataForChart:', this.dataForChart);
        // Trigger change detection
        this.cdr.detectChanges();
      });
    }
    else{
      this.provinceStationsLoaded = false;
      this.mapService.displayByObjectId(null);
      this.mapService.displayGeoJSON(null);

    }
  }
  onRegionSelect(): void {
    if (this.selectedRegionId !== null) {
      const geoJsonUrl = 'assets/regions.geojson';
      this.mapService.displayGeoJSON(geoJsonUrl);
      this.mapService.displayByObjectId(this.selectedRegionId);
      this.regionStationsLoaded = true;
      this.provinceStationsLoaded = false;
      this.byCodeLoaded= false;
      this.stationsLoaded = false;
      this.nearbyStationsLoaded =false;
      this.searchedLoaded= false;
      this.mapService.fetchStationsWithinPolygon(this.selectedRegionId).subscribe(stations => {
        this.dataForChart = this.mapService.countStationsByType(stations);
        console.log('Stations loaded, dataForChart:', this.dataForChart);
        // Trigger change detection
        this.cdr.detectChanges();
      });
    }
    else{
      this.regionStationsLoaded= false;
      this.mapService.displayByObjectId(null);
      this.mapService.displayGeoJSON(null);

    }
  }

  // this for selecting by code (each code us related to a type of station)
  onStationTypeSelect(): void {
    if (this.selectedStationCode !== null) {
      this.mapService.clearStations();
      this.clearWithinStations();
      this.mapService.stationByCode(this.selectedStationCode);
      this.byCodeLoaded= true;
      this.regionStationsLoaded= false;
      this.provinceStationsLoaded= false;
      this.stationsLoaded = false;
      this.nearbyStationsLoaded =false;
      this.searchedLoaded= false;
      this.mapService.fetchStationsByCodeData(this.selectedStationCode).subscribe(stations => {
        this.dataForChart = this.mapService.countStationsByType(stations);
        console.log('Stations loaded, dataForChart:', this.dataForChart);
        // Trigger change detection
        this.cdr.detectChanges();
      });
    }
    else{
      this.byCodeLoaded= false;
      this.mapService.clearStations();
    }
  }

  loadStations(): void {
    if (this.stationsLoaded) {
      this.stationsLoaded = false;
      this.mapService.clearStations();
      this.dataForChart = [];
      console.log('Stations cleared, dataForChart:', this.dataForChart);
      // Trigger change detection
      this.cdr.detectChanges();
    } else {

      this.mapService.displayStations();
      this.mapService.fetchStationData().subscribe(stations => {
        this.dataForChart = this.mapService.countStationsByType(stations);
        console.log('Stations loaded, dataForChart:', this.dataForChart);
        // Trigger change detection
        this.cdr.detectChanges();
      });
      this.stationsLoaded = true;
      this.nearbyStationsLoaded = false;
      this.searchedLoaded = false;
      this.byCodeLoaded= false;
      this.regionStationsLoaded= false;
      this.provinceStationsLoaded= false;
    }
  }

  openNearbyStationsDialog(): void {
    this.nearbyStationsLoaded = false;
    const dialogRef = this.dialog.open(NearbyStationsDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { latitude, longitude, distance } = result;
        this.mapService.loadNearbyStations(latitude, longitude, distance);
        this.mapService.fetchNearStationData(longitude,latitude,distance).subscribe(stations => {
          this.dataForChart = this.mapService.countStationsByType(stations);
          console.log('Stations loaded, dataForChart:', this.dataForChart);
          // Trigger change detection
          this.cdr.detectChanges();
        });
        this.nearbyStationsLoaded = true;
        this.byCodeLoaded= false;
        this.stationsLoaded = false;
        this.searchedLoaded= false;
        this.regionStationsLoaded= false;
        this.provinceStationsLoaded= false;
      }
    });
  }

  clearWithinStations(){
    this.mapService.clearWithinStations();
    this.nearbyStationsLoaded = false;
  }

  search(): void {
    this.searchedLoaded=false;
    if (this.searchKey.trim() !== '') {
      this.mapService.clearStations();
      this.clearWithinStations();
      this.mapService.searchStations(this.searchKey.trim());
      this.stationsLoaded = false;
      this.nearbyStationsLoaded= false;
      this.byCodeLoaded= false;
      this.searchedLoaded = true;
      this.regionStationsLoaded= false;
      this.provinceStationsLoaded= false;

      // loading data to chart
      this.mapService.fetchSearchedStationsData(this.searchKey).subscribe(stations => {
        this.dataForChart = this.mapService.countStationsByType(stations);
        console.log('Stations loaded, dataForChart:', this.dataForChart);
        // Trigger change detection
        this.cdr.detectChanges();
      });
    } else {
      this.searchedLoaded=false;
      this.mapService.clearStations();
    }
  }

  clearAll(): void {
    this.mapService.removeAll();
    this.mapView.graphics.removeAll();
    this.mapService.displayByObjectId(null);
    this.mapService.displayGeoJSON(null);
    this.stationsLoaded = false;
    this.nearbyStationsLoaded= false;
    this.byCodeLoaded= false;
    this.searchedLoaded = false;
    this.regionStationsLoaded= false;
    this.provinceStationsLoaded= false;
  }


}
