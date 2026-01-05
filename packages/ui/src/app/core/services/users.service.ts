import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import type { UpdateUserPayload } from '../../store/users/users.actions';
import type { User } from '../models/user.model';

interface UsersQueryResponse {
  data: {
    users: {
      items: User[];
      totalCount: number;
    };
  };
}

interface UpdateUserResponse {
  user: User;
  emailChanged: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);

  getUsers(
    offset: number,
    limit: number,
  ): Observable<{ users: User[]; totalCount: number }> {
    const query = `
      query GetUsers($offset: Int!, $limit: Int!) {
        users(offset: $offset, limit: $limit) {
          items {
            id
            email
            name
            preferredName
            role
            emailVerified
            createdAt
          }
          totalCount
        }
      }
    `;

    return this.http
      .post<UsersQueryResponse>(
        '/graphql',
        {
          query,
          variables: { offset, limit },
        },
        { withCredentials: true },
      )
      .pipe(
        map((response) => ({
          users: response.data.users.items,
          totalCount: response.data.users.totalCount,
        })),
      );
  }

  updateUser(
    payload: UpdateUserPayload,
  ): Observable<{ user: User; emailChanged: boolean }> {
    return this.http.patch<UpdateUserResponse>(
      `/api/admin/users/${payload.id}`,
      payload,
      { withCredentials: true },
    );
  }
}
