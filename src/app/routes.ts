import {Routes} from "@angular/router";

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/movies' },
  { path: 'movies', loadChildren: () => import('@single-file-ngrx/movies').then(m => m.MOVIES_ROUTES)},
  { path: '**', redirectTo: '/movies'}
];
