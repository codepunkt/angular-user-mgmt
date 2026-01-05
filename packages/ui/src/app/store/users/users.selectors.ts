import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { UsersState } from './users.state';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users,
);

export const selectTotalCount = createSelector(
  selectUsersState,
  (state) => state.totalCount,
);

export const selectOffset = createSelector(
  selectUsersState,
  (state) => state.offset,
);

export const selectLimit = createSelector(
  selectUsersState,
  (state) => state.limit,
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading,
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error,
);

export const selectSelectedUser = createSelector(
  selectUsersState,
  (state) => state.selectedUser,
);

export const selectUpdateLoading = createSelector(
  selectUsersState,
  (state) => state.updateLoading,
);

export const selectUpdateError = createSelector(
  selectUsersState,
  (state) => state.updateError,
);
