import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../services/Auth.service/auth.service';
import { Observable } from 'rxjs';

export interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
  
  productId?: number;
  productName?: string;
  price?: number;
  selected?: boolean;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  oldprice: number;
  price: number;
  description: string;
  imageUrl: string;
}

interface CartResponse {
  cartId: number;
  items: CartItem[];
}

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css'],
})
export class CartsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  subtotal: number = 0;
  shippingCost: number = 50;
  isLoading: boolean = false;
  error: string | null = null;
  cartId: number = 0; 

  constructor(private cartService: CartService, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems() {
    this.isLoading = true;
    this.error = null;
    
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Please login to view your cart';
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<CartResponse>('http://localhost:8080/cartItem', { headers })
      .subscribe({
        next: (response) => {
          console.log('Full response:', response);
          
          if (response && Array.isArray(response.items)) {
            this.cartId = response.cartId;
            
            response.items.forEach((item, index) => {
              console.log(`Item ${index}:`, item);
              console.log(`Item ${index} product:`, item.product);
              console.log(`Item ${index} imageUrl:`, item.product?.imageUrl);
            });
            
            this.cartItems = response.items.map(item => {
              const imageUrl = `http://localhost:8080/images/${item.product.imageUrl}`;
              console.log('Generated imageUrl:', imageUrl);
              
              return {
                id: item.id,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                product: item.product,
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price,
                selected: false,
                imageUrl: imageUrl
              };
            });
            
            console.log('Final cartItems:', this.cartItems);
            this.calculateTotalAmount();
          } else {
            this.cartItems = [];
            this.error = 'Invalid cart data received';
          }
        },
        error: (error) => {
          console.error('Error loading cart items', error);
          this.error = 'Failed to load cart items. Please try again later.';
          this.cartItems = [];
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  calculateTotalAmount() {
    this.subtotal = this.cartItems.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
    
    this.totalAmount = this.subtotal + this.shippingCost;
  }

  increaseQuantity(item: CartItem) {
    if (!item.productId) {
      console.error('Missing product ID');
      return;
    }
    const newQuantity = (item.quantity || 0) + 1;
    this.updateQuantity(this.cartId, item.productId, newQuantity);
  }

  decreaseQuantity(item: CartItem) {
    if (!item.productId) {
      console.error('Missing product ID');
      return;
    }
    const newQuantity = Math.max((item.quantity || 0) - 1, 1);
    this.updateQuantity(this.cartId, item.productId, newQuantity);
  }

  updateQuantity(cartId: number, productId: number, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(cartId, productId);
      return;
    }

    this.cartService.updateCartItemQuantity(cartId, productId, newQuantity).subscribe({
      next: (response) => {
        console.log('Item updated successfully:', response);
        // Refresh cart items to show updated data
        this.loadCartItems();
      },
      error: (error) => {
        this.error = 'Failed to update item quantity';
        console.error('Error updating quantity:', error);
      }
    });
  }

  checkout(cartId: number) {
    this.cartService.createOrder(cartId).subscribe({
      next: (order) => {
        alert('Order created successfully!');
        // Optionally refresh cart or redirect to "My Orders" page
        this.loadCartItems();
      },
      error: (err) => {
        alert('Failed to create order.');
        console.error(err);
      }
    });
  }
  
  

  removeItem(cartId: number, productId: number): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeCartItem(cartId, productId).subscribe({
        next: (response) => {
          console.log('Item removed successfully:', response);
          // Remove item from local array for immediate UI update
          this.cartItems = this.cartItems.filter(item => 
            !(item.productId === productId) // use productId instead of cartId
          );
          this.calculateTotalAmount(); // Recalculate totals after removal
        },
        error: (error) => {
          this.error = 'Failed to remove item';
          console.error('Error removing item:', error);
        }
      });
    }
  }

  removeItemFromCart(item: CartItem): void {
    if (!item.productId) {
      console.error('Missing product ID');
      return;
    }
    this.removeItem(this.cartId, item.productId);
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
  
    if (!token) {
      throw new Error('User is not authenticated.');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());
  
    return this.http.post('http://localhost:8080/cartItem/item/add', null, {
      headers,
      params
    });
  }
}