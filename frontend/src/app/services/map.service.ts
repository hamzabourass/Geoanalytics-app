import {Station} from "../models/station.model";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Point from "@arcgis/core/geometry/Point";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Polygon from "@arcgis/core/geometry/Polygon";
import Sketch from "@arcgis/core/widgets/Sketch";
import Editor from "@arcgis/core/widgets/Editor";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import {GeometryService} from "./geometry.service";
import {LayerService} from "./layer.service";
import {TransportStationService} from "./transport-station.service";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {Injectable} from "@angular/core";
import EsriMap from '@arcgis/core/Map';
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Geometry from "@arcgis/core/geometry/Geometry";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly map: EsriMap;
  private mapView!: MapView;
  private readonly graphicsLayer: GraphicsLayer;
  private readonly pointLayer: FeatureLayer;
  private readonly lineLayer: FeatureLayer;
  private readonly polygonLayer: FeatureLayer;
  private selectedBasemap: string = 'streets';
  private stationGraphics: Graphic[] = [];
  private stationWithinGraphics: Graphic[] = [];
  private currentGeoJsonLayer: GeoJSONLayer | null = null;

  constructor(
    private stationService: TransportStationService,
    private layerService: LayerService,
    private geometryService: GeometryService
  ) {
    this.map = new EsriMap({ basemap: this.selectedBasemap });
    this.graphicsLayer = new GraphicsLayer();

    this.pointLayer = this.layerService.getPointLayer();
    this.polygonLayer = this.layerService.getPolygonLayer();
    this.lineLayer = this.layerService.getLineLayer();

    this.map.addMany([this.graphicsLayer, this.pointLayer, this.lineLayer, this.polygonLayer]);
  }

  initializeMapView(container: string): MapView {
    this.mapView = new MapView({
      container: container,
      map: this.map,
      center: [-9.56, 30.42],
      zoom: 4
    });
    return this.mapView;
  }

  changeBasemap(basemap: string): void {
    this.map.basemap = basemap;
  }

  initializeEditor(view: MapView): void {

    const editor = new Editor({
      view: view,
      layerInfos: [
        {
          layer: this.pointLayer,
          enabled: true,
          addEnabled: true,
          updateEnabled: true,
          deleteEnabled: true
        },
        {
          layer: this.polygonLayer,
          enabled: true,
          addEnabled: true,
          updateEnabled: true,
          deleteEnabled: true
        },
        {
          layer: this.lineLayer,
          enabled: true,
          addEnabled: true,
          updateEnabled: true,
          deleteEnabled: true
        },

      ]
    });

    editor.on('sketch-update', this.handleSketchUpdate.bind(this));

    const sketch = new Sketch({
      view: view,
      layer: this.graphicsLayer,
      creationMode: 'update',
      availableCreateTools: ['point', 'polyline', 'polygon']
    });


    view.ui.add(sketch, 'top-right');
    view.ui.add(editor, 'top-right');

  }


  private handleSketchUpdate(event: any): void {
    const updatedGraphics = event.detail;

    if (updatedGraphics) {
      updatedGraphics.graphics.forEach((updatedGraphic: { geometry: any; }) => {
        const geometry = updatedGraphic.geometry;

        if (geometry) {
          if (geometry.type === 'point') {
            const coordinates = geometry as Point;
            this.loadNearbyStations(coordinates.latitude, coordinates.longitude, 2000);
          } else if (geometry.type === 'polygon') {
            const polygonGeometry = geometry as Polygon;
            const convertedRings = this.geometryService.convertPolygonRings(polygonGeometry.rings);
            const payload = { coordinates: convertedRings };
            this.stationService.getStationsWithinPolygon(payload).subscribe(
              (response: Station[]) => this.loadStationsWithinPolygon(response),
                (error: any) => console.error('Error sending polygon to API:', error)
            );
          } else if (geometry.type === 'polyline') {
            console.log('Updated Polyline Paths:', geometry.toJSON().paths);
          }
        }
      });
    }
  }

  removeAll(){
    this.graphicsLayer.removeAll();
  }

  // Display provinces and regions from geojson files
  displayGeoJSON(url: string | null): void {
    if (this.currentGeoJsonLayer) {
      this.map.remove(this.currentGeoJsonLayer);
      this.currentGeoJsonLayer = null;
    }

    if (url) {
      this.currentGeoJsonLayer = new GeoJSONLayer({
        url: url,
        blendMode: 'average',
        popupTemplate: {
          title: '{title}',
          content: [{
            type: 'fields',
            fieldInfos: [
              { fieldName: 'OBJECTID', label: 'Object ID', visible: true },
              { fieldName: 'Nom', label: 'Name', visible: true },
              { fieldName: 'CODE_PROVI', label: 'Province Code', visible: true },
              { fieldName: 'NOM_PROV', label: 'Province Name', visible: true },
              { fieldName: 'NOM_REG', label: 'Region Name', visible: true }
            ]
          }]
        }
      });

      this.map.add(this.currentGeoJsonLayer);
    }
  }

  displayProvinceByObjectId(objectId: number | null): void {
    // Remove current highlight and clear map graphics
    if (!objectId){
      this.mapView.graphics.removeAll();
      return
    }

    if (objectId && this.currentGeoJsonLayer) {
      // Query the GeoJSON layer to find the selected province by OBJECTID
      const query = this.currentGeoJsonLayer.createQuery();
      query.where = `OBJECTID = ${objectId}`;

      this.currentGeoJsonLayer.queryFeatures(query)
        .then((result) => {
          if (result.features.length > 0) {
            const selectedFeature = result.features[0];
            const polygonGeometry = selectedFeature.geometry as Polygon;

            const highlightSymbol = new SimpleFillSymbol({
              color: [0, 255, 0, 0.5], // Green color with 50% transparency
              outline: {
                color: [0, 0, 0],
                width: 1
              }
            });

            const highlightGraphic = new Graphic({
              geometry: polygonGeometry,
              symbol: highlightSymbol
            });

            const convertedRings = this.geometryService.convertPolygonRings(polygonGeometry.rings);
            const payload = { coordinates: convertedRings };
            console.log("payload: ", payload);

            this.stationService.getStationsWithinPolygon(payload).subscribe(
              (response: Station[]) => this.loadStationsWithinPolygon(response),
              (error: any) => console.error('Error sending polygon to API:', error)
            );

            this.mapView.graphics.add(highlightGraphic);

            this.mapView.goTo(selectedFeature.geometry.extent).catch(error => {
              console.error('Error zooming to selected feature:', error);
            });
          } else {
            console.warn(`No features found with OBJECTID ${objectId}`);
          }
        })
        .catch((error) => {
          console.error('Error querying features:', error);
        });
    }
  }

  displayStations(): void {
    this.stationService.getStations().subscribe(
        (stations: Station[]) => {
        stations.forEach(station => {
          const graphic = this.createStationGraphic(station);
          this.stationGraphics.push(graphic);
          this.graphicsLayer.add(graphic);
          this.mapView.graphics.add(graphic);
        });
      },
        (error: any)=> console.error('Error fetching stations:', error)
    );
  }

  searchStations(keySearch:  string): void{
    this.stationService.searchStations(keySearch).subscribe(
      (stations: Station[]) => {
        stations.forEach(station => {
          const graphic = this.createStationGraphic(station);
          this.stationGraphics.push(graphic);
          this.graphicsLayer.add(graphic);
          this.mapView.graphics.add(graphic);
        });

      },
      (error: any)=> console.error('Error fetching stations:', error)
    );
  }

  stationByCode(code:  number): void{
    this.stationService.stationByCode(code).subscribe(
      (stations: Station[]) => {
        stations.forEach(station => {
          const graphic = this.createStationGraphic(station);
          this.stationGraphics.push(graphic);
          this.graphicsLayer.add(graphic);
          this.mapView.graphics.add(graphic);
        });

      },
      (error: any)=> console.error('Error fetching stations:', error)
    );
  }

  private createStationGraphic(station: Station): Graphic {
    const point = new Point({
      x: station.geometry.longitude,
      y: station.geometry.latitude,
      spatialReference: { wkid: 4326 }
    });

    const markerSymbol = new SimpleMarkerSymbol({
      color: [226, 119, 40],
      outline: { color: [0, 0, 0], width: 1 },
      size: 8
    });

    return new Graphic({
      geometry: point,
      symbol: markerSymbol,
      attributes: {
        id: station.id,
        name: station.name,
        code: station.code,
        fclass: station.fclass
      },
      popupTemplate: {
        title: `{name}`,
        content: [{
          type: 'text',
          text: `ID: {id}<br>Code: {code}<br>fclass:{fclass}`
        }]
      }
    });
  }


  loadStationsWithinPolygon(stations: Station[]): void {
    this.clearStations();
    stations.forEach(station => {
      const graphic = this.createStationGraphic(station);
      this.stationWithinGraphics.push(graphic);
      this.graphicsLayer.add(graphic);
    });

    if (this.stationWithinGraphics.length > 0) {
      const extent = this.graphicsLayer.graphics.reduce((acc, graphic) => {
        return acc ? acc.union(graphic.geometry.extent) : graphic.geometry.extent;
      }, null as any);

      this.mapView.goTo(extent).catch(error => console.error('Error zooming to stations:', error));
    }
  }

  loadNearbyStations(latitude: number, longitude: number, distanceMeters: number): void {
    this.clearStations();

    this.stationService.getNearbyStations(latitude, longitude, distanceMeters).subscribe(
      stations => {
        stations.forEach(station => {
          const graphic = this.createStationGraphic(station);
          this.stationWithinGraphics.push(graphic);
          this.graphicsLayer.add(graphic);
          this.mapView.graphics.add(graphic);
        });

        this.mapView.goTo({
          center: [longitude, latitude],
          zoom: 10
        }).then(r => console.log("zooming"));
      },
      error => console.error('Error fetching nearby stations:', error)
    );
  }

  clearStations(): void {
    this.stationGraphics.forEach(graphic => this.mapView.graphics.remove(graphic));
    this.stationGraphics = [];
  }

  clearWithinStations(): void {
    this.stationWithinGraphics.forEach(graphic => this.mapView.graphics.remove(graphic));
    this.stationGraphics = [];
  }

  private zoomToGraphicsExtent(): void {
    if (this.stationGraphics.length > 0) {
      let combinedExtent: any = null;

      this.stationGraphics.forEach(graphic => {
        const geometry = graphic.geometry as Geometry;
        const graphicExtent = geometry.extent;

        if (!combinedExtent) {
          combinedExtent = graphicExtent.clone();
        } else {
          combinedExtent = combinedExtent.union(graphicExtent);
        }
      });

      // Zoom to the combined extent
      if (combinedExtent) {
        this.mapView.goTo({ target: combinedExtent });
      }
    }
  }

}
