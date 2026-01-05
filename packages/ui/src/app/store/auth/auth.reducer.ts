import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.checkSession, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.checkSessionSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    initialized: true,
  })),

  on(AuthActions.checkSessionFailure, (state) => ({
    ...state,
    user: null,
    loading: false,
    initialized: true,
  })),

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
    registrationPending: false,
  })),

  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
    registrationPending: true,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    registrationPending: false,
  })),

  on(AuthActions.clearRegistrationPending, (state) => ({
    ...state,
    registrationPending: false,
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    loading: false,
  })),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
