import {Component, OnInit} from '@angular/core';

import {Movie} from "../../models/movie";
import {injectMoviesFeature} from "../../store/movies";
import {SearchMoviesBoxComponent} from "../../components/search-movies-box/search-movies-box.component";
import {MoviesListComponent} from "../../components/movies-list/movies-list.component";
import {PushModule} from "@ngrx/component";

@Component({
  standalone: true,
  selector: 'app-search-movies-page',
  templateUrl: './search-movies-page.component.html',
  styleUrls: ['./search-movies-page.component.scss'],
  imports: [
    SearchMoviesBoxComponent,
    MoviesListComponent,
    PushModule
  ],
})
export class SearchMoviesPageComponent implements OnInit {
  private readonly facade = injectMoviesFeature();
  readonly loading$ = this.facade.loading$;
  readonly movies$ = this.facade.movies$;
  readonly currentMovies$ = this.facade.currentMovie$;

  ngOnInit(): void {
    this.facade.search();
  }

  onSearch(searchTerm: string): void {
    this.facade.search(searchTerm);
  }

  onFavoriteMovie(movie: Movie): void {
    this.facade.toggleFavorite(movie);
  }
}
