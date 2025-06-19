import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../app/models/Order.dto';
import { UserDTO } from '../../app/models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080'; // adapt as needed

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(`${this.apiUrl}/orders`);
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users`);
  }

  getStats(): Observable<{ totalOrders: number, totalRevenue: number }> {
    return this.http.get<{ totalOrders: number, totalRevenue: number }>(`${this.apiUrl}/admin/stats`);
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  addProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/create`, productData);
  }
  
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
  updateProduct(id: number, productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, productData);
  }
  
}