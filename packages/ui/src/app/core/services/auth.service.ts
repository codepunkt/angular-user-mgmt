import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import type { CurrentUser } from '../models/user.model';

interface SessionResponse {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  } | null;
  user: CurrentUser | null;
}

interface SignInResponse {
  user: CurrentUser;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';

  getSession(): Observable<CurrentUser | null> {
    return this.http
      .get<SessionResponse>(`${this.apiUrl}/get-session`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.user));
  }

  signIn(email: string, password: string): Observable<CurrentUser> {
    return this.http
      .post<SignInResponse>(
        `${this.apiUrl}/sign-in/email`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(map((response) => response.user));
  }

  signOut(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/sign-out`,
      {},
      { withCredentials: true },
    );
  }
}
