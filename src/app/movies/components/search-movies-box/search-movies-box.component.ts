import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

@Component({
  standalone: true,
  selector: 'app-search-movies-box',
  templateUrl: './search-movies-box.component.html',
  styleUrls: ['./search-movies-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    NgIf,
    MatIconModule
  ],
})
export class SearchMoviesBoxComponent {
  @Output() readonly search = new EventEmitter<string>();
  value = '';
}
