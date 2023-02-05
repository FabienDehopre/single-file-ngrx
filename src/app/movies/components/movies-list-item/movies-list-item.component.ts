import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {Movie} from "../../models/movie";

@Component({
  standalone: true,
  selector: 'app-movies-list-item',
  templateUrl: './movies-list-item.component.html',
  styleUrls: ['./movies-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule],
})
export class MoviesListItemComponent {
  @Input() movie?: Movie;
  @Output() readonly favorite = new EventEmitter<Movie>();
}
