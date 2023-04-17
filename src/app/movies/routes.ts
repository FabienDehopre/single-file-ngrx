import {Routes} from "@angular/router";
import {provideMoviesFeature} from "./store/movies";
import {SearchMoviesPageComponent} from "./pages/search-movies-page/search-movies-page.component";
import {importProvidersFrom} from "@angular/core";
import {MatSnackBarModule} from "@angular/material/snack-bar";

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SearchMoviesPageComponent,
    providers: [
      provideMoviesFeature(),
      importProvidersFrom(MatSnackBarModule)
    ]
  }
];
