import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  checkSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkSession),
      exhaustMap(() =>
        this.authService.getSession().pipe(
          map((user) =>
            user
              ? AuthActions.checkSessionSuccess({ user })
              : AuthActions.checkSessionFailure(),
          ),
          catchError(() => of(AuthActions.checkSessionFailure())),
        ),
      ),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.authService.signIn(email, password).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error.error?.message || 'Login failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/users'])),
      ),
    { dispatch: false },
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, password, name, preferredName }) =>
        this.authService.signUp({ email, password, name, preferredName }).pipe(
          map((user) => AuthActions.registerSuccess({ user })),
          catchError((error) =>
            of(
              AuthActions.registerFailure({
                error: error.error?.message || 'Registration failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/users'])),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.signOut().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((error) =>
            of(
              AuthActions.logoutFailure({
                error: error.error?.message || 'Logout failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );
}
