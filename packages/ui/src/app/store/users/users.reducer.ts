import { createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { initialUsersState } from './users.state';

export const usersReducer = createReducer(
  initialUsersState,

  on(UsersActions.loadUsers, (state, { offset, limit }) => ({
    ...state,
    offset: offset ?? state.offset,
    limit: limit ?? state.limit,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadUsersSuccess, (state, { users, totalCount }) => ({
    ...state,
    users,
    totalCount,
    loading: false,
  })),

  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.selectUser, (state, { user }) => ({
    ...state,
    selectedUser: user,
    updateError: null,
  })),

  on(UsersActions.clearSelectedUser, (state) => ({
    ...state,
    selectedUser: null,
    updateError: null,
  })),

  on(UsersActions.updateUser, (state) => ({
    ...state,
    updateLoading: true,
    updateError: null,
  })),

  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser: null,
    updateLoading: false,
  })),

  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    updateLoading: false,
    updateError: error,
  })),

  on(UsersActions.clearUpdateError, (state) => ({
    ...state,
    updateError: null,
  })),
);
