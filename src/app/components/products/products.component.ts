import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../Auth.service/auth.service';
interface ProductDetails {
  [key: string]: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'] 
})
export class ProductsComponent implements OnInit {
  items: any[] = [];

  constructor(
    private cartService: CartService,
    private productsService: ProductsService,
    private authService: AuthService,
    private http: HttpClient

  ) {}

  ngOnInit(): void {
    this.productsService.getProductsList().subscribe(data => {
      this.items = data.map(product => ({
        ...product,
        image: this.getImage(product.name),
        shortDescription: this.getShortDescription(product.name),
        fullDescription: this.getFullDescription(product.name),
        oldPrice: this.getOldPrice(product.name),
        newPrice: product.price,
        showFullDescription: false,
        readMoreText: 'Read More'
      }));
    });
  }

  getImage(name: string): string {
    const images: ProductDetails = {
      'Airpods Max': 'airpods-max.png',
      'Airpods Pro': 'airpods.png',
      'Apple Watch': 'apple-watch.png'
    };
    return images[name] || 'default.png';
  }

  getShortDescription(name: string): string {
    const descriptions: ProductDetails = {
      'Airpods Max': 'Premium noise-cancelling headphones with high-quality sound.',
      'Airpods Pro': 'Noise-cancelling earbuds with great comfort and sound.',
      'Apple Watch': 'A smartwatch with advanced health tracking and connectivity.'
    };
    return descriptions[name] || 'No description available.';
  }

  getFullDescription(name: string): string {
    const fullDescriptions: ProductDetails = {
      'Airpods Max': 'Airpods Max is designed to offer the ultimate sound experience, combining powerful noise-cancelling technology with a rich, immersive sound profile.',
      'Airpods Pro': 'Airpods Pro offers industry-leading active noise cancellation, a customizable fit, and superior sound quality, making them perfect for any environment.',
      'Apple Watch': 'Apple Watch comes with health tracking features such as ECG, heart rate monitoring, and more, while keeping you connected with notifications and messages on the go.'
    };
    return fullDescriptions[name] || 'No full description available.';
  }

  getOldPrice(name: string): string {
    const prices: ProductDetails = {
      'Airpods Max': '2000',
      'Airpods Pro': '1500',
      'Apple Watch': '3000'
    };
    return prices[name] || '0';
  }

  toggleDescription(index: number): void {
    const item = this.items[index];
    item.showFullDescription = !item.showFullDescription;
    item.readMoreText = item.showFullDescription ? 'Read Less' : 'Read More';
  }

  addToCart(productId: string, quantity: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:8080/api/cart/add', { productId, quantity }, { headers })
        .subscribe(response => {
            console.log('Product added to cart', response);
        }, error => {
            console.error('Error adding to cart', error);
        });
}



}
