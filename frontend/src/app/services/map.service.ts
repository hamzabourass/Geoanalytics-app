import {Injectable} from '@angular/core';
import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Editor from '@arcgis/core/widgets/Editor';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Sketch from "@arcgis/core/widgets/Sketch";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Point from "@arcgis/core/geometry/Point";
import {TransportStationService} from "./transport-station.service";
import Extent from "@arcgis/core/geometry/Extent";

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
  private stationWithinGraphics: Graphic[]=[];
  constructor(private stationService: TransportStationService) {
    this.map = new EsriMap({
      basemap: this.selectedBasemap
    });
    this.graphicsLayer = new GraphicsLayer();


    this.pointLayer = new FeatureLayer({
      source: [],
      title: 'Points',
      blendMode:"darken",
      fields: [
        { name: 'ObjectID', alias: 'ObjectID', type: 'oid' },
        { name: 'Name', alias: 'Name', type: 'string' },
        { name: 'Description', alias: 'Description', type: 'string' },
      ],
      objectIdField: 'ObjectID',
      geometryType: 'point',
      spatialReference: { wkid: 4326 },
      popupTemplate: {
        title: "{Name}",
        content: [{
          type: "fields",
          fieldInfos: [
            { fieldName: "Name", label: "Name", visible: true },
            { fieldName: "Description", label: "Description", visible: true },
          ]
        }]
      }
    });

    this.lineLayer = new FeatureLayer({
      title: 'Line',
      source: [],
      fields: [
        { name: 'ObjectID', alias: 'ObjectID', type: 'oid' },
        { name: 'Name', alias: 'Name', type: 'string' },
        { name: 'Description', alias: 'Description', type: 'string' },
      ],
      objectIdField: 'ObjectID',
      geometryType: 'polyline',
      spatialReference: { wkid: 4326 },
      popupTemplate: {
        title: "{Name}",
        content: [{
          type: "fields",
          fieldInfos: [
            { fieldName: "Name", label: "Name", visible: true },
            { fieldName: "Description", label: "Description", visible: true },
          ]
        }]
      }
    });

    this.polygonLayer = new FeatureLayer({
      title: 'Polygon',
      source: [],
      fields: [
        { name: 'ObjectID', alias: 'ObjectID', type: 'oid' },
        { name: 'Name', alias: 'Name', type: 'string' },
        { name: 'Description', alias: 'Description', type: 'string' },
      ],
      objectIdField: 'ObjectID',
      geometryType: 'polygon',
      spatialReference: { wkid: 4326 },
      popupTemplate: {
        title: "{Name}",
        content: [{
          type: "fields",
          fieldInfos: [
            { fieldName: "Name", label: "Name", visible: true },
            { fieldName: "Description", label: "Description", visible: true },
          ]
        }]
      }
    });

    this.map.add(this.graphicsLayer);
    this.map.add(this.pointLayer);
    this.map.add(this.lineLayer);
    this.map.add(this.polygonLayer);
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

  getGraphicsLayer(): GraphicsLayer {
    return this.graphicsLayer;
  }

  getPointLayer(): FeatureLayer {
    return this.pointLayer;
  }

  getLineLayer(): FeatureLayer {
    return this.lineLayer;
  }

  getPolygonLayer(): FeatureLayer {
    return this.polygonLayer;
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
          layer: this.lineLayer,
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
        }
      ]
    });

    // Handle 'sketch-create' event for capturing new geometry coordinates
    editor.on('sketch-create', (event) => {
      const graphic = event.detail;

      if (graphic) {
        const geometry = graphic.graphic;

        if (geometry) {
          if (geometry.geometry.type === 'point') {
            console.log('Point Coordinates:', geometry.geometry.toJSON().x , geometry.geometry.toJSON().y);
          } else if (geometry.geometry.type === 'polygon') {
            const polygonGeometry = geometry.geometry;
            console.log('Polygon Rings:', geometry.geometry.toJSON().rings);
          } else if (geometry.geometry.type === 'polyline') {
            console.log('Polyline Paths:', geometry.geometry.toJSON().paths);
          }
        }
      }
    });

    const sketch = new Sketch({
      view: view,
      layer: this.graphicsLayer,
      creationMode: 'update',
      availableCreateTools: ['point', 'polyline', 'polygon']
    });

    view.ui.add(sketch, 'top-right')
    view.ui.add(editor, 'top-right');
  }

  displayGeoJSON(url: string): void {
    const geoJSONLayer = new GeoJSONLayer({
      url: url,
      blendMode: "average",
      popupTemplate: {
        title: '{title}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'OBJECTID', // Adjust based on your properties
                label: 'Object ID',
                visible: true
              },
              {
                fieldName: 'Nom', // Adjust based on your properties
                label: 'Name',
                visible: true
              },
              {
                fieldName: 'CODE_PROVI', // Adjust based on your properties
                label: 'Province Code',
                visible: true
              },
              {
                fieldName: 'NOM_PROV', // Adjust based on your properties
                label: 'Province Name',
                visible: true
              },
              {
                fieldName: 'NOM_REG', // Adjust based on your properties
                label: 'Region Name',
                visible: true
              }
            ]
          }
        ]
      }
    });

    this.map.add(geoJSONLayer);
  }


  displayStations(): void {
    this.stationService.getStations().subscribe(
      stations => {
        stations.forEach(station => {
          const point = new Point({
            x: station.geometry.longitude,
            y: station.geometry.latitude,
            spatialReference: { wkid: 4326 } // Assuming WGS84 coordinate system
          });

          const markerSymbol = new SimpleMarkerSymbol({
            color: [226, 119, 40],
            outline: {
              color: [0, 0, 0],
              width: 1
            },
            size: 8
          });

          const graphic = new Graphic({
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


          this.stationGraphics.push(graphic); // Store graphic reference
          this.graphicsLayer.add(graphic);

        });
      },
      error => {
        console.error('Error fetching stations:', error);
      }
    );
  }
  loadNearbyStations(latitude: number, longitude: number, distanceMeters: number): void {
    // Clear existing stations
    this.clearStations();

    // Fetch nearby stations
    this.stationService.getNearbyStations(latitude, longitude, distanceMeters).subscribe(
      stations => {
        stations.forEach(station => {
          const point = new Point({
            x: station.geometry.longitude,
            y: station.geometry.latitude,
            spatialReference: { wkid: 4326 } // Assuming WGS84 coordinate system
          });

          const markerSymbol = new SimpleMarkerSymbol({
            color: [226, 119, 40],
            outline: {
              color: [255, 255, 255],
              width: 1
            },
            size: 8
          });

          const graphic = new Graphic({
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

          this.stationWithinGraphics.push(graphic); // Store graphic reference
          this.graphicsLayer.add(graphic);
        });

        this.mapView.goTo({
          center: [longitude, latitude],  // Note: Longitude first, then latitude
          zoom: 10  // Adjust zoom level as needed
        }).then(r => {
          console.log("zooming")
        });
      },
      error => {
        console.error('Error fetching nearby stations:', error);
      }
    );
  }

  clearWithinStations(): void {
    this.stationWithinGraphics.forEach(graphic => {
      this.graphicsLayer.remove(graphic); // Remove each graphic from the layer
    });
    this.stationGraphics = []; // Clear the array
  }

  clearStations(): void {
    this.stationGraphics.forEach(graphic => {
      this.graphicsLayer.remove(graphic); // Remove each graphic from the layer
    });
    this.stationGraphics = []; // Clear the array
  }
}
