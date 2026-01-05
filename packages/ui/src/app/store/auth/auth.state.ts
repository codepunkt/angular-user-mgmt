import type { CurrentUser } from '../../core/models/user.model';

export interface AuthState {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  registrationPending: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
  registrationPending: false,
};
