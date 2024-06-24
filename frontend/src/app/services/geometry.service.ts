import {Injectable} from "@angular/core";
import Point from "@arcgis/core/geometry/Point";

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  convertPolygonRings(rings: number[][][]): { longitude: number, latitude: number }[] {
    const formattedCoordinates: { longitude: number, latitude: number }[] = [];
    rings.forEach(ring => {
      ring.forEach(point => {
        const [longitude, latitude] = this.convertToGeographic(point[0], point[1]);
        formattedCoordinates.push({ longitude, latitude });
      });
    });
    return formattedCoordinates;
  }

  convertToGeographic(x: number, y: number): [number, number] {
    const point = new Point({
      x: x,
      y: y,
      spatialReference: { wkid: 3857 }
    });
    return [point.longitude, point.latitude];
  }
}
