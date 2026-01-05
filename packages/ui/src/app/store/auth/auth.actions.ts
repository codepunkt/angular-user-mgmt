import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { CurrentUser } from '../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Check Session': emptyProps(),
    'Check Session Success': props<{ user: CurrentUser }>(),
    'Check Session Failure': emptyProps(),

    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ user: CurrentUser }>(),
    'Login Failure': props<{ error: string }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
  },
});
