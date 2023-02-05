import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Movie} from "../../models/movie";
import {MoviesListItemComponent} from "../movies-list-item/movies-list-item.component";
import {NgForOf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MoviesListItemComponent,
    NgForOf
  ],
})
export class MoviesListComponent {
  @Input() movies: Movie[] = [];
  @Output() readonly favoriteMovie = new EventEmitter<Movie>();

  readonly movieTrackBy = (index: number, movie: Movie) => movie.id;
}
