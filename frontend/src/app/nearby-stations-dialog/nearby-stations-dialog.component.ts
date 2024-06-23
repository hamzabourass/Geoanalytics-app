import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-nearby-stations-dialog',
  templateUrl: './nearby-stations-dialog.component.html',
  styleUrls: ['./nearby-stations-dialog.component.css']
})
export class NearbyStationsDialogComponent {
  latitude!: number;
  longitude!: number;
  distance!: number;

  constructor(
    public dialogRef: MatDialogRef<NearbyStationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
