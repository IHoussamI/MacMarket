import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/v1/auth/authenticate';
  private registerUrl = 'http://localhost:8080/api/v1/auth/register';

  constructor(private http: HttpClient) {}

  register(user: { firstname: string; lastname: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.registerUrl, user)
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  authenticate(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials)
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of(null); 
      }));
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.authenticate(credentials);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
