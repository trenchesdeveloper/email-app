import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface UsernameAvailableResponse {
  available: boolean;
}

interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}
interface SignupResponse {
  username: string;
}

interface SigninResponse {
  username: string;
}

interface SignedInResponse {
  authenticated: boolean;
  username: string;
}

interface SigninCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  rootUrl = 'https://api.angular-email.com/auth';

  public signedin$ = new BehaviorSubject<boolean | null>(null);
  username: string = '';

  constructor(private http: HttpClient) {}

  usernameAvailable(username: string): Observable<UsernameAvailableResponse> {
    return this.http.post<UsernameAvailableResponse>(
      `${this.rootUrl}/username`,
      {
        username,
      }
    );
  }

  signup(credentials: SignupCredentials) {
    return this.http
      .post<SignupResponse>(`${this.rootUrl}/signup`, credentials)
      .pipe(
        tap((response) => {
          // change the value os si
          this.signedin$.next(true);

          this.username = response.username;
        })
      );
  }

  checkAuth() {
    return this.http.get<SignedInResponse>(`${this.rootUrl}/signedin`).pipe(
      tap((response) => {
        const { authenticated, username } = response;
        this.signedin$.next(authenticated);
        this.username = username;
      })
    );
  }

  signout() {
    return this.http.post<any>(`${this.rootUrl}/signout`, {}).pipe(
      tap((response) => {
        this.signedin$.next(false);
      })
    );
  }

  signin(credentials: SigninCredentials) {
    return this.http
      .post<SigninResponse>(`${this.rootUrl}/signin`, credentials)
      .pipe(
        tap((response) => {
          this.signedin$.next(true);
          this.username = response.username;
        })
      );
  }
}
