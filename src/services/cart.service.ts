import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { AuthService } from '../app/Auth.service/auth.service';
import { CartItem } from '../app/models/CartItem.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = "http://localhost:8080/api/cart";
  private totalAmountSource = new BehaviorSubject<number>(0);
  totalAmount$ = this.totalAmountSource.asObservable();
  constructor(private http: HttpClient, private authService: AuthService) { }

  getCartItems() {
    const token = this.authService.getToken(); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }
  updateCartItemQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${itemId}`, { quantity });
  }


  removeCartItem(productId: number, headers: HttpHeaders): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`, { headers });
}

addToCart(productId: number, quantity: number): Observable<any> {
  const url = 'http://localhost:8080/api/v1/cartItem/item/add';
  const params = {
    productId: productId.toString(),
    quantity: quantity.toString()
  };
  return this.http.post<any>(url, null, { params, withCredentials: true })
    .pipe(
      catchError(error => {
        console.error('Error adding to cart:', error);
        return of(null); 
      })
    );
}
  
  payForItems(selectedItems: CartItem[]): Observable<any> {
    console.log('Mock payment for items:', selectedItems);
    return of({ success: true, message: 'Payment successful!' });
}
}