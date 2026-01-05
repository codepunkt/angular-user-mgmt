import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { User, UserRole } from '../../core/models/user.model';

export interface UpdateUserPayload {
  id: string;
  name?: string;
  preferredName?: string | null;
  role?: UserRole;
}

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': props<{ offset?: number; limit?: number }>(),
    'Load Users Success': props<{ users: User[]; totalCount: number }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Select User': props<{ user: User }>(),
    'Clear Selected User': emptyProps(),

    'Update User': props<{ payload: UpdateUserPayload }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    'Clear Update Error': emptyProps(),
  },
});
