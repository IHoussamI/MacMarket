import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/auth/authenticate';
  private registerUrl = 'http://localhost:8080/auth/register';

  private userStatus = new BehaviorSubject<{ isLoggedIn: boolean; firstName: string | null; role: string | null }>({
    isLoggedIn: false,
    firstName: null,
    role: null
  });
  public userStatus$ = this.userStatus.asObservable();

  constructor(private http: HttpClient) {
    this.checkInitialLoginStatus();
  }

  private checkInitialLoginStatus() {
    const token = localStorage.getItem('token');
    const firstName = localStorage.getItem('firstName');
    const role = localStorage.getItem('role');
    if (token && firstName && role) {
      this.userStatus.next({ isLoggedIn: true, firstName: firstName, role: role });
    } else {
      this.userStatus.next({ isLoggedIn: false, firstName: null, role: null });
    }
  }

  register(user: { firstname: string; lastname: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.registerUrl, user)
      .pipe(tap(response => {
        if (response && response.token && response.firstname && response.role) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('firstName', response.firstname);
          localStorage.setItem('role', response.role);
          this.userStatus.next({ isLoggedIn: true, firstName: response.firstname, role: response.role });
        }
      })
    );
  }

  authenticate(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials)
      .pipe(
        tap(response => {
          if (response && response.token && response.firstname && response.role) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('firstName', response.firstname);
            localStorage.setItem('role', response.role);
            this.userStatus.next({ isLoggedIn: true, firstName: response.firstname, role: response.role });
          } else {
            this.userStatus.next({ isLoggedIn: false, firstName: null, role: null });
          }
        }),
        catchError(error => {
          console.error('Login failed:', error);
          this.userStatus.next({ isLoggedIn: false, firstName: null, role: null });
          return of(null);
        })
      );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.authenticate(credentials);
  }

  isAuthenticated(): boolean {
    return this.userStatus.getValue().isLoggedIn;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('role');
    this.userStatus.next({ isLoggedIn: false, firstName: null, role: null });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
