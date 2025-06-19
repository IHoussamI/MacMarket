import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin-service/admin-service.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  orders: any[] = [];
  users: any[] = [];
  products: any[] = [];
  stats = { totalOrders: 0, totalRevenue: 0 };

  loading = {
    orders: false,
    users: false,
    stats: false,
  };

  errors = {
    orders: '',
    users: '',
    stats: '',
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.getOrders();
    this.getUsers();
    this.getStats();
    this.getProducts();
  }

  getOrders() {
    this.loading.orders = true;
    this.adminService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading.orders = false;
      },
      error: (err) => {
        this.errors.orders = 'Failed to load orders';
        this.loading.orders = false;
      }
    });
  }

  getUsers() {
    this.loading.users = true;
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading.users = false;
      },
      error: (err) => {
        this.errors.users = 'Failed to load users';
        this.loading.users = false;
      }
    });
  }

  getStats() {
    this.loading.stats = true;
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading.stats = false;
      },
      error: (err) => {
        this.errors.stats = 'Failed to load statistics';
        this.loading.stats = false;
      }
    });
  }

  getProducts() {
    this.adminService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Failed to load products');
      }
    });
  }
  
}
  