import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  type ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthActions } from './store/auth/auth.actions';
import { AuthEffects } from './store/auth/auth.effects';
import { authReducer } from './store/auth/auth.reducer';
import { selectAuthInitialized } from './store/auth/auth.selectors';
import { UsersEffects } from './store/users/users.effects';
import { usersReducer } from './store/users/users.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    MessageService,
    provideStore({
      auth: authReducer,
      users: usersReducer,
    }),
    provideEffects([AuthEffects, UsersEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideAppInitializer(() => {
      const store = inject(Store);
      store.dispatch(AuthActions.checkSession());
      return firstValueFrom(
        store.select(selectAuthInitialized).pipe(
          filter((initialized) => initialized),
          take(1),
        ),
      );
    }),
  ],
};
