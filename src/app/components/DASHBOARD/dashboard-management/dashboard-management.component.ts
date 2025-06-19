import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin-service/admin-service.service';
import { TruncatePipe } from '../../../pipes/truncate.pipe';

@Component({
  selector: 'app-dashboard-management',
  standalone: true,
  imports: [CommonModule, FormsModule,TruncatePipe],
  templateUrl: './dashboard-management.component.html',
  styleUrl: './dashboard-management.component.css'
})
export class DashboardManagementComponent implements OnInit {
  products: any[] = [];
  users: any[] = [];
  editMode = false;
  editProductId: number | null = null;
  searchTerm: string = '';
  userSearchTerm: string = '';


  newProduct = {
    name: '',
    price: 0,
    oldprice: 0,
    description: '',
  };
  

  selectedImage: File | null = null;


  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }
  
  

  loadProducts(): void {
    this.adminService.getAllProducts().subscribe(data => {
      this.products = data;
    });
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(productId).subscribe(() => {
        this.loadProducts();
      });
    }
  }
  editProduct(product: any) {
    this.newProduct = { ...product };
    this.editMode = true;
    this.editProductId = product.id;
    document.getElementById('productForm')?.scrollIntoView({ behavior: 'smooth' });
  }
  updateProduct() {
    if (this.editProductId == null) return;
  
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('price', this.newProduct.price.toString());
    if (this.newProduct.oldprice) formData.append('oldprice', this.newProduct.oldprice.toString());
    if (this.newProduct.description) formData.append('description', this.newProduct.description);
    if (this.selectedImage) formData.append('image', this.selectedImage);
  
    this.adminService.updateProduct(this.editProductId, formData).subscribe(() => {
      this.loadProducts(); // refresh product list
      this.resetForm();
    });
  }
  refreshProducts(): void {
    this.loadProducts();
  }
  get selectedFileName(): string {
    return this.selectedImage ? this.selectedImage.name : '';
  }
  cancelEdit(): void {
    this.resetForm();
  }
      
  
  resetForm(): void {
    this.newProduct = {
      name: '',
      price: 0,
      oldprice: 0,
      description: '',
    };
    this.selectedImage = null;
    this.editMode = false;
    this.editProductId = null;
  }

  addProduct(): void {
    if (!this.selectedImage) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('price', this.newProduct.price.toString());
    formData.append('oldprice', this.newProduct.oldprice.toString());
    formData.append('description', this.newProduct.description);
    formData.append('image', this.selectedImage);

    this.adminService.addProduct(formData).subscribe(() => {
      this.loadProducts();
      this.newProduct = { name: '', price: 0, oldprice: 0, description: '' };
      this.selectedImage = null;
    });
  }

  get filteredProducts(): any[] {
    if (!this.searchTerm) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  get filteredUsers(): any[] {
    if (!this.userSearchTerm) return this.users;
    return this.users.filter(u =>
      u.username.toLowerCase().includes(this.userSearchTerm.toLowerCase())
    );
  }


  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
