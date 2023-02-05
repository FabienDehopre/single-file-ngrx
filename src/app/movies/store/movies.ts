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
import {catchError, exhaustMap, map, Observable, of} from "rxjs";

import {Movie} from "../models/movie";
import {MoviesService} from "../services/movies.service";

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
    search: props<{ searchTerm?: string }>(),
    loaded: props<{ movies: Movie[] }>(),
    failed: props<{ error: string }>(),
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

export function provideMoviesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(moviesFeature),
    provideEffects({ search$ }),
  ]);
}

export interface MoviesFeature {
  loading$: Observable<boolean>;
  movies$: Observable<Movie[]>;
  currentMovie$: Observable<Movie | undefined>;
  search: (searchTerm?: string) => void;
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
  };
}
