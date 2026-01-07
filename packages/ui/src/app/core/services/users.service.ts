import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import type { UpdateUserPayload } from '../../store/users/users.actions';
import type { User } from '../models/user.model';

interface UsersQueryResponse {
  data: {
    users: {
      items: User[];
      total: number;
    };
  };
}

interface UpdateUserMutationResponse {
  data?: {
    updateUser: User;
  };
  errors?: Array<{ message: string }>;
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
          total
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
          totalCount: response.data.users.total,
        })),
      );
  }

  updateUser(payload: UpdateUserPayload): Observable<{ user: User }> {
    const mutation = `
      mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
          id
          email
          name
          preferredName
          role
          emailVerified
          createdAt
        }
      }
    `;

    const { id, ...input } = payload;

    return this.http
      .post<UpdateUserMutationResponse>(
        '/graphql',
        {
          query: mutation,
          variables: { id, input },
        },
        { withCredentials: true },
      )
      .pipe(
        map((response) => {
          if (response.errors?.length) {
            throw new Error(response.errors[0].message);
          }
          if (!response.data) {
            throw new Error('No data returned from server');
          }
          return { user: response.data.updateUser };
        }),
      );
  }
}
