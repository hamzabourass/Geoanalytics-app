import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LayerService {
  getPointLayer(): FeatureLayer {
    return new FeatureLayer({
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
  }

  getLineLayer(): FeatureLayer {
    return new FeatureLayer({
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
  }

  getPolygonLayer(): FeatureLayer {
    return new FeatureLayer({
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
  }
}
