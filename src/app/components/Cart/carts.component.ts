import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../Auth.service/auth.service';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  selected?: boolean; 
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

  constructor(private cartService: CartService, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
      this.loadCartItems();
  }

  loadCartItems() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    this.http.get<CartResponse>('http://localhost:8080/api/cart', { headers })
        .subscribe(response => {
            console.log('Cart items loaded', response);
            this.cartItems = response.items.map(item => ({
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                quantity: item.quantity,
                selected: false 
            }));
            this.calculateTotalAmount(); 
            localStorage.setItem('totalAmount', this.totalAmount.toString()); 
        }, error => {
            console.error('Error loading cart items', error);
        });
}
calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateQuantity(itemId: number, quantity: number) {
      this.cartService.updateCartItemQuantity(itemId, quantity).subscribe(() => {
          this.loadCartItems();
      });
  }

  removeItem(productId: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    this.cartService.removeCartItem(productId, headers).subscribe(
        response => {
            console.log('Response from server:', response);
            if (response && response.message) { 
                this.loadCartItems(); 
            } else {
                console.error('Unexpected response format:', response);
            }
        },
        error => {
            console.error('Error removing item from cart', error);
        }
    );
}

addToCart(productId: number, quantity: number) {
    this.cartService.addToCart(productId, quantity).subscribe(
      () => {
        console.log('Product added to cart successfully');
      },
      (error) => {
        console.error('Failed to add product to cart:', error);
      }
    );
  }
 /* payForSelectedItems() {
    const selectedItems = this.cartItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
        alert('Please select at least one item to proceed with payment.');
        return;
    }

    this.cartService.payForItems(selectedItems).subscribe(response => {
        if (response.success) {
            alert(response.message);
            this.loadCartItems();
        }
    }, error => {
        console.error('Payment failed', error);
    });
}*/
}
