import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GeojsonService {

  constructor(private http: HttpClient) { }

  getRegionData(): Observable<any> {
    return this.http.get<any>('assets/regions.geojson');
  }

  getProvinceData(): Observable<any> {
    return this.http.get<any>('assets/province.geojson');
  }

}
