import {inject, Inject} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Movie} from "../models/movie";

@Inject({ providedIn: 'root' })
export class MoviesService {
  private readonly http = inject(HttpClient);

  findMovies(searchTerm?: string): Observable<Movie[]> {
    let params = new HttpParams();
    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('q', searchTerm);
    }

    return this.http.get<Movie[]>('/movies', { params });
  }

  markAsFavorite(movie: Movie): Observable<Movie> {
    return this.http.patch<Movie>(`/movies/${movie.id}`, { favorite: true });
  }
}
