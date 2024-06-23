import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyStationsDialogComponent } from './nearby-stations-dialog.component';

describe('NearbyStationsDialogComponent', () => {
  let component: NearbyStationsDialogComponent;
  let fixture: ComponentFixture<NearbyStationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NearbyStationsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NearbyStationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
