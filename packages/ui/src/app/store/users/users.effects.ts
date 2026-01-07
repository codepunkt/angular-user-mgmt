import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { UsersService } from '../../core/services/users.service';
import { UsersActions } from './users.actions';
import { selectLimit, selectOffset } from './users.selectors';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private usersService = inject(UsersService);
  private messageService = inject(MessageService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      withLatestFrom(
        this.store.select(selectOffset),
        this.store.select(selectLimit),
      ),
      exhaustMap(([action, storeOffset, storeLimit]) => {
        const offset = action.offset ?? storeOffset;
        const limit = action.limit ?? storeLimit;
        return this.usersService.getUsers(offset, limit).pipe(
          map(({ users, totalCount }) =>
            UsersActions.loadUsersSuccess({ users, totalCount }),
          ),
          catchError((error) =>
            of(
              UsersActions.loadUsersFailure({
                error: error.error?.message || 'Failed to load users',
              }),
            ),
          ),
        );
      }),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      exhaustMap(({ payload }) =>
        this.usersService.updateUser(payload).pipe(
          map(({ user }) => UsersActions.updateUserSuccess({ user })),
          catchError((error) =>
            of(
              UsersActions.updateUserFailure({
                error: error.message || 'Failed to update user',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully.',
          });
        }),
      ),
    { dispatch: false },
  );

  updateUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }),
      ),
    { dispatch: false },
  );
}
