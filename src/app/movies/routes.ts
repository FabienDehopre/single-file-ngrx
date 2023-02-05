import {Routes} from "@angular/router";
import {provideMoviesFeature} from "./store/movies";
import {SearchMoviesPageComponent} from "./pages/search-movies-page/search-movies-page.component";

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SearchMoviesPageComponent,
    providers: [
      provideMoviesFeature()
    ]
  }
];
