import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MapComponent} from "./map/map.component";
import {TemplateComponent} from "./template/template.component";

const routes: Routes = [
  {path:'', component: TemplateComponent, children:[
      { path: 'map', component: MapComponent },

    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
