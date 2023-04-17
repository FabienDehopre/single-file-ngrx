import {EnvironmentProviders, inject, makeEnvironmentProviders} from "@angular/core";
import {Actions, createEffect, ofType, provideEffects} from "@ngrx/effects";
import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  on,
  props,
  provideState, Store
} from "@ngrx/store";
import {catchError, concatMap, exhaustMap, map, Observable, of, tap} from "rxjs";

import {Movie} from "../models/movie";
import {MoviesService} from "../services/movies.service";
import {MatSnackBar} from "@angular/material/snack-bar";

interface MoviesState {
  loading: boolean;
  collection: Movie[];
  currentMovieId: number | undefined;
}

const initialState: MoviesState = {
  loading: false,
  collection: [],
  currentMovieId: undefined,
};

const moviesActions = createActionGroup({
  source: 'Movies',
  events: {
    'Search': props<{ searchTerm?: string }>(),
    'Loaded': props<{ movies: Movie[] }>(),
    'Failed': props<{ error: string }>(),
    'Toggle Favorite': props<{ movie: Movie }>(),
    'Toggle Favorite Success': props<{ movie: Movie }>(),
    'Toggle Favorite Failed': props<{ error: string }>()
  }
});

const moviesFeature = createFeature({
  name: 'movies',
  reducer: createReducer(
    initialState,
    on(moviesActions.search, (state) => {
      return {
        ...state,
        loading: true,
        collection: [],
      };
    }),
    on(moviesActions.loaded, (state, { movies }) => {
      return {
        ...state,
        loading: false,
        collection: movies,
        currentMovieId: undefined,
      };
    }),
    on(moviesActions.failed, (state) => {
      return {
        ...state,
        loading: false,
        collection: [],
        currentMovieId: undefined,
      };
    }),
    on(moviesActions.toggleFavoriteSuccess, (state, {movie}) => {
      return {
        ...state,
        collection: state.collection.map(m => {
          if (m.id === movie.id) {
            return movie;
          }

          return m;
        }),
      };
    })
  ),
  extraSelectors: ({ selectCollection, selectCurrentMovieId }) => {
    return {
      selectCurrentMovie: createSelector(
        selectCollection,
        selectCurrentMovieId,
        (movies, currentMovieId) => {
          return movies.find(m => m.id === currentMovieId)
        }
      )
    };
  }
});

const search$ = createEffect((actions$ = inject(Actions)) => {
  const service = inject(MoviesService);
  return actions$.pipe(
    ofType(moviesActions.search),
    exhaustMap(({ searchTerm }) => {
      return service.findMovies(searchTerm).pipe(
        map((movies) => moviesActions.loaded({ movies })),
        catchError(() => of(moviesActions.failed({ error: 'Cannot load movies' })))
      );
    })
  );
}, { functional: true });

const toggleFavorite$ = createEffect((actions$ = inject(Actions)) => {
  const service = inject(MoviesService);
  return actions$.pipe(
    ofType(moviesActions.toggleFavorite),
    concatMap(({ movie }) => {
      return service.toggleFavorite(movie).pipe(
        map((result) =>  moviesActions.toggleFavoriteSuccess({ movie: result })),
        catchError(() => of(moviesActions.toggleFavoriteFailed({ error: 'Error toggling favorite' })))
      );
    })
  );
}, { functional: true });

const errorHandling$ = createEffect((actions$ = inject(Actions)) => {
  const matSnackBar = inject(MatSnackBar);
  return actions$.pipe(
    ofType(moviesActions.failed, moviesActions.toggleFavoriteFailed),
    tap(({ error }) => {
      matSnackBar.open(error, undefined, {
        duration: 5000,
        panelClass: 'mat-mdc-snackbar-error',
        politeness: 'assertive',
      });
    })
  );
}, { functional: true, dispatch: false });

export function provideMoviesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(moviesFeature),
    provideEffects({ search$, toggleFavorite$, errorHandling$ }),
  ]);
}

export interface MoviesFeature {
  loading$: Observable<boolean>;
  movies$: Observable<Movie[]>;
  currentMovie$: Observable<Movie | undefined>;
  search: (searchTerm?: string) => void;
  toggleFavorite: (movie: Movie) => void;
}

export function injectMoviesFeature(): MoviesFeature {
  const store = inject(Store);
  const {
    selectCollection,
    selectCurrentMovie,
    selectLoading
  } = moviesFeature;

  return {
    loading$: store.select(selectLoading),
    movies$: store.select(selectCollection),
    currentMovie$: store.select(selectCurrentMovie),
    search: (searchTerm) => store.dispatch(moviesActions.search({ searchTerm })),
    toggleFavorite: (movie) => store.dispatch(moviesActions.toggleFavorite({ movie })),
  };
}
