import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MapComponent} from "./map/map.component";
import {TemplateComponent} from "./template/template.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/map',  // Redirect empty path to /map
    pathMatch: 'full'    // Ensure full path match for redirection
  },
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: 'map', component: MapComponent },
      { path: '**', component: PageNotFoundComponent } // Wildcard route for non-existent URLs
    ]
  },
  {
    path: '**',
    redirectTo: '/map',  // Redirect all other invalid routes to /map
    pathMatch: 'full'    // Ensure full path match for redirection
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
