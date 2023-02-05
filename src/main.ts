import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {APP_ROUTES} from "./app/routes";
import {provideHttpClient} from "@angular/common/http";
import {provideStore} from "@ngrx/store";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {provideEffects} from "@ngrx/effects";

bootstrapApplication(AppComponent, { providers: [
  provideRouter(APP_ROUTES),
    provideHttpClient(),
    provideStore(),
    provideStoreDevtools(),
    provideEffects()
  ] }).catch((err) => console.error(err));
