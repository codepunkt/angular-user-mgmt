import type { User } from '../../core/models/user.model';

export interface UsersState {
  users: User[];
  totalCount: number;
  offset: number;
  limit: number;
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  updateLoading: boolean;
  updateError: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  totalCount: 0,
  offset: 0,
  limit: 10,
  loading: false,
  error: null,
  selectedUser: null,
  updateLoading: false,
  updateError: null,
};
