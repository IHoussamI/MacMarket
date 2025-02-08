import { Component, OnInit } from '@angular/core';
import { Products } from '../../common/products';
import { ProductsService } from '../../services/products.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  products: Products[] = [];
  
  constructor (private productsservice : ProductsService) {}

    ngOnInit():void{
      this.listProducts();
    }
    listProducts(): void {
      this.productsservice.getProductsList().subscribe(
        data => {
          console.log('Products:', data); 
          this.products = data;
        },
        error => {
          console.error('Error fetching products', error);
        }
      );
    }
  }

