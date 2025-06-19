import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface Product {
  id?: string;
  name: string;
  price?: number;
  imageUrl: string;
  shortDescription: string;
  fullDescription: string;
  oldPrice?: number;
  showFullDescription?: boolean;
  readMoreText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private cache: Product[] | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly API_URL = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    const now = Date.now();
    
    // Return cached data if available and not expired
    if (this.cache && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return of(this.cache);
    }

    return this.http.get<Product[]>(this.API_URL).pipe(
      map(products => this.enrichProducts(products)),
      tap(products => {
        this.cache = products;
        this.lastFetchTime = now;
      }),
      catchError(error => {
        console.error('Error fetching products, using fallback:', error);
        if (this.cache) {
          return of(this.cache); 
        }
        return of(this.getMockProducts());
      })
    );
  }

  private enrichProducts(products: Product[]): Product[] {
    return products.map(product => ({
      ...product,
      image: this.getImage(product.name),
      shortDescription: this.getShortDescription(product.name),
      fullDescription: this.getFullDescription(product.name),
      oldPrice: this.getOldPrice(product.name),
      showFullDescription: false,
      readMoreText: 'Read More'
    }));
  }

  private getMockProducts(): Product[] {
    const mockNames = ['Airpods Max', 'Airpods Pro', 'Apple Watch'];
    return mockNames.map(name => ({
      id: this.generateMockId(name),
      name,
      price: this.getMockPrice(name),
      imageUrl: this.getImage(name),
      shortDescription: this.getShortDescription(name),
      fullDescription: this.getFullDescription(name),
      oldPrice: this.getOldPrice(name),
      showFullDescription: false,
      readMoreText: 'Read More'
    }));
  }

  
  
  

  private generateMockId(name: string): string {
    return `mock-${name.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`;
  }

  private getMockPrice(name: string): number {
    const priceMap: {[key: string]: number} = {
      'Airpods Max': 549,
      'Airpods Pro': 249,
      'Apple Watch': 399
    };
    return priceMap[name] || 0;
  }

  private getImage(name: string): string {
    const images: {[key: string]: string} = {
      'Airpods Max': 'airpods-max.png',
      'Airpods Pro': 'airpods.png',
      'Apple Watch': 'apple-watch.png'
    };
    return images[name] || 'default.png';
  }

  private getShortDescription(name: string): string {
    const descriptionMap: {[key: string]: string} = {
      'Airpods Max': 'Premium over-ear headphones with Active Noise Cancellation',
      'Airpods Pro': 'Premium in-ear headphones with Active Noise Cancellation',
      'Apple Watch': 'The most advanced Apple Watch with health and fitness features'
    };
    return descriptionMap[name] || 'Premium Apple product with cutting-edge technology';
  }

  private getFullDescription(name: string): string {
    const fullDescriptionMap: {[key: string]: string} = {
      'Airpods Max': `Premium over-ear headphones with Active Noise Cancellation .AirPods Max combine high-fidelity audio with industry-leading Active Noise Cancellation to deliver an unparalleled listening experience. Each part of their custom-built driver works to produce sound with ultra-low distortion across the audible range. From deep, rich bass to accurate mids and crisp, clean highs, you'll hear every note with a new sense of clarity.`,
      'Airpods Pro': `Premium in-ear headphones with Active Noise Cancellation . AirPods Pro feature Active Noise Cancellation for immersive sound. Transparency mode for hearing the world around you. A customizable fit for all-day comfort. And sweat and water resistance. The Apple-designed H1 chip delivers incredible audio performance and connectivity.`,
      'Apple Watch': `The most advanced Apple Watch yet. Featuring the Always-On Retina display, the ECG app, international emergency calling, fall detection, and the new Noise app. Apple Watch Series 7 represents our largest and most advanced display yet. The larger display enhances the entire experience, making it easier to use and read.`
    };
    return fullDescriptionMap[name] || `This premium Apple ${name} combines innovative technology with elegant design to deliver exceptional performance and user experience.`;
  }

  private getOldPrice(name: string): number {
    const oldPriceMap: {[key: string]: number} = {
      'Airpods Max': 599,
      'Airpods Pro': 279,
      'Apple Watch': 429
    };
    return oldPriceMap[name] || 0;
  }
}