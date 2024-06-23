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
import Point from '@arcgis/core/geometry/Point';
import {TransportStationService} from "./transport-station.service";
import Polygon from "@arcgis/core/geometry/Polygon";
import {Station} from "../models/station.model";

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
  private currentGeoJsonLayer: GeoJSONLayer | null = null;
  constructor(private stationService: TransportStationService) {
    this.map = new EsriMap({
      basemap: this.selectedBasemap
    });
    this.graphicsLayer = new GraphicsLayer();


    this.pointLayer = new FeatureLayer({
      source: [],
      title: 'Find near stations by point',
      blendMode: "difference",
      fields: [
        { name: 'ObjectID', alias: 'ObjectID', type: 'oid' },
        { name: 'Name', alias: 'Name', type: 'string' },
        { name: 'Description', alias: 'Description', type: 'string' },
        { name: 'Distance', alias: 'Distance', type: 'double' },

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
            { fieldName: "Distance", label: "Distance", visible: true },

          ]
        }]
      }
    });

    this.lineLayer = new FeatureLayer({
      title: 'Line',
      source: [],
      blendMode: "difference",
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
      title: 'Find stations within a user-drawn polygon',
      blendMode: "difference",
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

    editor.on('sketch-update', (event) => {
      const updatedGraphics = event.detail;

      if (updatedGraphics) {
        updatedGraphics.graphics.forEach(updatedGraphic => {
          const geometry = updatedGraphic.geometry;

          if (geometry) {
            if (geometry.type === 'point') {
              this.graphicsLayer.removeAll();
              const coordinates = geometry as Point;
              this.loadNearbyStations(coordinates.latitude, coordinates.longitude, 2000);
              console.log('Updated Point Coordinates:', coordinates.longitude, coordinates.latitude);
            } else if (geometry.type === 'polygon') {
              this.graphicsLayer.removeAll();
              const polygonGeometry = geometry as Polygon;
              const convertedRings = this.convertPolygonRings(polygonGeometry.rings);
              console.log('Converted Polygon Rings:', convertedRings);

              const payload = {
                coordinates: convertedRings
              };
              console.log('Payload for API:', payload);
              console.log('Payload for API:', payload);

              this.stationService.getStationsWithinPolygon(payload).subscribe(
                response => {
                  console.log('Response from API:', response);
                  this.loadStationsWithinPolygon(response)
                },
                error => {
                  console.error('Error sending polygon to API:', error);
                }
              );
            } else if (geometry.type === 'polyline') {
              console.log('Updated Polyline Paths:', geometry.toJSON().paths);
            }
          }
        });
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

  displayGeoJSON(url: string | null): void {
    // Remove existing GeoJSON layer if it exists
    if (this.currentGeoJsonLayer) {
      this.map.remove(this.currentGeoJsonLayer);
      this.currentGeoJsonLayer = null;
    }

    if (url) {
      // Add new GeoJSON layer
      this.currentGeoJsonLayer = new GeoJSONLayer({
        url: url,
        blendMode: 'average',
        popupTemplate: {
          title: '{title}',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'OBJECTID', label: 'Object ID', visible: true },
                { fieldName: 'Nom', label: 'Name', visible: true },
                { fieldName: 'CODE_PROVI', label: 'Province Code', visible: true },
                { fieldName: 'NOM_PROV', label: 'Province Name', visible: true },
                { fieldName: 'NOM_REG', label: 'Region Name', visible: true }
              ]
            }
          ]
        }
      });

      this.map.add(this.currentGeoJsonLayer);
    }
  }



   convertPolygonRings = (rings: number[][][]): { longitude: number, latitude: number }[] => {
    // Convert each ring of points
    const formattedCoordinates: { longitude: number, latitude: number }[] = [];

    rings.forEach(ring => {
      ring.forEach(point => {
        const [longitude, latitude] = this.convertToGeographic(point[0], point[1]); // Convert projected to geographic
        formattedCoordinates.push({ longitude, latitude });
      });
    });

    return formattedCoordinates;
  };

   convertToGeographic = (x: number, y: number): [number, number] => {
    const point = new Point({
      x: x,
      y: y,
      spatialReference: { wkid: 3857 } // Assuming the coordinates are in EPSG:3857 (Web Mercator)
    });

    return [point.longitude, point.latitude]; // Returns [longitude, latitude]
  };

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

  loadStationsWithinPolygon(stations: Station[]): void {
    this.clearStations();
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
            text: `ID: {id}<br>Code: {code}<br>fclass: {fclass}`
          }]
        }
      });

      this.stationWithinGraphics.push(graphic); // Store graphic reference
      this.graphicsLayer.add(graphic);
    });

    if (this.stationWithinGraphics.length > 0) {
      const extent = this.graphicsLayer.graphics.reduce((acc, graphic) => {
        return acc ? acc.union(graphic.geometry.extent) : graphic.geometry.extent;
      }, null as any);

      this.mapView.goTo(extent).catch(error => {
        console.error('Error zooming to stations:', error);
      });
    }
  }

  loadNearbyStations(latitude: number, longitude: number, distanceMeters: number): void {
    // Clear existing stations
    this.clearStations();

    console.log("called with :",  )
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
          center: [longitude, latitude],
          zoom: 10
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
      this.graphicsLayer.remove(graphic);
    });
    this.stationGraphics = [];
  }

  clearStations(): void {
    this.stationGraphics.forEach(graphic => {
      this.graphicsLayer.remove(graphic);
    });
    this.stationGraphics = [];
  }
}
