import {Movie} from "../models/movie";
import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  on,
  props,
  provideState, Store
} from "@ngrx/store";
import {Actions, createEffect, ofType, provideEffects} from "@ngrx/effects";
import {EnvironmentProviders, inject, makeEnvironmentProviders} from "@angular/core";
import {catchError, exhaustMap, map, Observable, of} from "rxjs";
import {MoviesService} from "../services/movies.service";

export interface MoviesState {
  loading: boolean;
  collection: Movie[];
  currentMovieId: number | undefined;
}

export const INITIAL_STATE: MoviesState = {
  loading: false,
  collection: [],
  currentMovieId: undefined,
};

export const MOVIES_ACTIONS = createActionGroup({
  source: 'Movies',
  events: {
    search: props<{ searchTerm?: string }>(),
    loaded: props<{ movies: Movie[] }>(),
    failed: props<{ error: string }>(),
  }
});

export const MOVIES_FEATURE = createFeature({
  name: 'movies',
  reducer: createReducer(
    INITIAL_STATE,
    on(MOVIES_ACTIONS.search, (state) => {
      return {
        ...state,
        loading: true,
        collection: [],
      };
    }),
    on(MOVIES_ACTIONS.loaded, (state, { movies }) => {
      return {
        ...state,
        loading: false,
        collection: movies,
        currentMovieId: undefined,
      };
    }),
    on(MOVIES_ACTIONS.failed, (state) => {
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

export const {
  selectCollection,
  selectCurrentMovie,
  selectLoading
} = MOVIES_FEATURE;

export const search$ = createEffect((actions$ = inject(Actions)) => {
  const service = inject(MoviesService);
  return actions$.pipe(
    ofType(MOVIES_ACTIONS.search),
    exhaustMap(({ searchTerm }) => {
      return service.findMovies(searchTerm).pipe(
        map((movies) => MOVIES_ACTIONS.loaded({ movies })),
        catchError(() => of(MOVIES_ACTIONS.failed({ error: 'Cannot load movies' })))
      );
    })
  );
}, { functional: true });

export function provideMoviesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(MOVIES_FEATURE),
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

  return {
    loading$: store.select(selectLoading),
    movies$: store.select(selectCollection),
    currentMovie$: store.select(selectCurrentMovie),
    search: (searchTerm) => store.dispatch(MOVIES_ACTIONS.search({ searchTerm })),
  };
}
