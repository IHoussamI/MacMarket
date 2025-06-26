import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../Auth.service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = "http://localhost:8080/cart";
  private totalAmountSource = new BehaviorSubject<number>(0);
  totalAmount$ = this.totalAmountSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Error fetching cart items:', error);
        return throwError(() => error);
      })
    );
  }

  createOrder(cartId: number): Observable<any> {
    return this.http.post(`http://localhost:8080/orders/create/${cartId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
  

  updateCartItemQuantity(cartId: number, productId: number, quantity: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found');
      return throwError(() => new Error('No authentication token'));
    }

    const params = new HttpParams().set('quantity', quantity.toString());

    return this.http.put<any>(
      `http://localhost:8080/cartItem/cart/${cartId}/item/${productId}/update`, 
      null, 
      { 
        headers: this.getAuthHeaders(),
        params: params,
        withCredentials: true 
      }
    ).pipe(
      catchError(error => {
        console.error('Error updating cart item:', error);
        return throwError(() => error);
      })
    );
  }

  removeCartItem(cartId: number, productId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found');
      return throwError(() => new Error('No authentication token'));
    }

    return this.http.delete(
      `http://localhost:8080/cartItem/cart/${cartId}/item/${productId}`, 
      { 
        headers: this.getAuthHeaders(),
        withCredentials: true 
      }
    ).pipe(
      catchError(error => {
        console.error('Error removing item from cart:', error);
        return throwError(() => error);
      })
    );
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found');
      return throwError(() => new Error('No authentication token'));
    }

    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<any>(
      'http://localhost:8080/cartItem/item/add', 
      null, 
      { 
        params, 
        headers: this.getAuthHeaders(),
        withCredentials: true 
      }
    ).pipe(
      catchError(error => {
        console.error('Error adding to cart:', error);
        return throwError(() => error);
      })
    );
  }
  
 
  updateTotalAmount(amount: number): void {
    this.totalAmountSource.next(amount);
  }
}