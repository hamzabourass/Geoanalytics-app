import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { TemplateComponent } from './template/template.component';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDrawer,MatDrawerContent, MatDrawerContainer} from "@angular/material/sidenav";
import {MatNavList} from "@angular/material/list";
import {MatCard, MatCardContent, MatCardHeader,MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MapService} from "./services/map.service";
import {HttpClientModule} from "@angular/common/http";
import { NearbyStationsDialogComponent } from './nearby-stations-dialog/nearby-stations-dialog.component';
import {MatDialogClose, MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {CdkOverlayOrigin} from "@angular/cdk/overlay";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TemplateComponent,
    NearbyStationsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbar,
    MatIcon,
    MatMenu,
    MatDrawerContainer,
    MatNavList,
    MatMenuItem,
    MatDrawer,
    MatDrawerContent,
    MatMenuTrigger,
    MatCard,
    MatCardHeader,
    MatDivider,
    MatCardContent,
    MatCardTitle,
    MatProgressSpinner,
    HttpClientModule,
    MatDialogClose,
    FormsModule,
    MatDialogModule,
    MatInput,
    CdkOverlayOrigin,
    MatButtonToggleGroup,
    MatButtonToggle

  ],
  providers: [
    provideAnimationsAsync(),
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
