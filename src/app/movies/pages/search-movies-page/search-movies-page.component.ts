import {Component, OnInit} from '@angular/core';

import {Movie} from "../../models/movie";
import {injectMoviesFeature} from "../../store/movies";

@Component({
  selector: 'app-search-movies-page',
  standalone: true,
  imports: [],
  templateUrl: './search-movies-page.component.html',
  styleUrls: ['./search-movies-page.component.scss'],
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
    // TODO
  }
}
