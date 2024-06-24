import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private stationDataSubject = new BehaviorSubject<any[]>([]);
  stationData$ = this.stationDataSubject.asObservable();

  constructor() {}

  updateStationData(data: any[]): void {
    this.stationDataSubject.next(data);
  }}
