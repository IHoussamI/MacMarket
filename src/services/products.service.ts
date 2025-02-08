import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../common/products';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  
  private baseUrl = "http://localhost:8080/api/products";

  constructor(private httpClient: HttpClient) { }
  getProductsList(): Observable<Products[]> {
    return this.httpClient.get<Products[]>(this.baseUrl); 
  }
}
