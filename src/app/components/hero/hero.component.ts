import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service.service';
import { CartService } from '../../../services/cart/cart.service';
import { AuthService } from '../../../services/Auth.service/auth.service';

interface ProductDetails {
  [key: string]: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  items: any[] = [];
  loading = true;
  error = false;
  usingFallback = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = false;
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.items = products.map((product: any) => {
          const storedStatus = localStorage.getItem(`stockStatus_${product.id}`);
          const isOutOfStock = storedStatus ? storedStatus === 'true' : product.isOutOfStock;
        
          return {
            ...product,
            isOutOfStock,
            image: `http://localhost:8080/images/${product.imageUrl || product.image}`
          };
        });
        
        this.loading = false;
        this.usingFallback = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.usingFallback = true;
      }
    });
  }

  toggleDescription(index: number) {
    this.items[index].showFullDescription = !this.items[index].showFullDescription;
    this.items[index].readMoreText = this.items[index].showFullDescription ? 'Read Less' : 'Read More';
  }

  addToCart(productId: number) {
    if (!this.authService.getToken()) {
      console.log('Please login to add items to cart');
      return;
    }

    this.cartService.addToCart(productId, 1).subscribe({
      next: (response) => {
        if (response) {
          console.log('Product added to cart successfully');
        } else {
          console.error('Failed to add product to cart');
        }
      },
      error: (error) => {
        console.error('Failed to add product to cart:', error);
      }
    });
  }
}