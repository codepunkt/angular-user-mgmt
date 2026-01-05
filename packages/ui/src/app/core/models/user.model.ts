export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  preferredName: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

export interface CurrentUser extends User {
  image?: string | null;
}
