import { TestBed } from '@angular/core/testing';

import { TransportStationService } from './transport-station.service';

describe('TransportStationService', () => {
  let service: TransportStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
