import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Station} from "../models/station.model";

@Injectable({
  providedIn: 'root'
})
export class TransportStationService {

  private apiUrl = 'http://localhost:8888/api/stations'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.apiUrl}`).pipe(
      map((response: Station[]) => {

        if (response == null) {
          throw new Error('Response is null or undefined');
        }


        // filter stations with null data on their data
        return response.filter(station =>
          station.geometry && station.geometry.longitude != null && station.geometry.latitude != null
        );
      }),
      catchError((error) => {
        console.error('Error fetching stations:', error);
        return throwError(error);
      })
    );
  }

  getNearbyStations(latitude: number, longitude: number, distanceMeters: number): Observable<any[]> {
    const url = `${this.apiUrl}/within?longitude=${longitude}&latitude=${latitude}&distance=${distanceMeters}`;
    return this.http.get<Station[]>(url).pipe(
      map((response: Station[]) => {

        if (response == null) {
          throw new Error('Response is null or undefined');
        }

        return response.filter(station =>
          station.geometry && station.geometry.longitude != null && station.geometry.latitude != null
        );
      }),
      catchError((error) => {
        console.error('Error fetching stations:', error);
        return throwError(error);
      })
    );
  }

  getStationsWithinPolygon(polygonCoordinates: any): Observable<Station[]> {
    console.log('get station within polygon invoked')
    const url = `${this.apiUrl}/withinPolygon`;
    return this.http.post<Station[]>(url, polygonCoordinates).pipe(
      map((response: Station[]) => {
        if (response == null) {
          throw new Error('Response is null or undefined');
        }
        return response.filter(station =>
          station.geometry && station.geometry.longitude != null && station.geometry.latitude != null
        );
      }),
      catchError((error) => {
        console.error('Error fetching stations within polygon:', error);
        return throwError(error);
      })
    );
  }

}
