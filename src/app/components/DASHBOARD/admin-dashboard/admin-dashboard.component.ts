import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin-service/admin-service.service';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);

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
  salesChart: any;
  productsChart: any;

  loading = {
    orders: false,
    users: false,
    stats: false,
    sales: false,
    topProducts: false
  };

  errors = {
    orders: '',
    users: '',
    stats: '',
    sales: '',
    topProducts: ''
  };

  constructor(private adminService: AdminService, private http: HttpClient) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.getOrders();
    this.getUsers();
    this.getStats();
    this.getProducts();
    this.loadSalesChart();
    this.loadProductsChart();
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
  loadSalesChart() {
    this.loading.sales = true;
    this.http.get<{ date: string, totalSales: number }[]>('http://localhost:8080/orders/statistics/sales-over-time').subscribe({
      next: (data) => {
        const dates = data.map(item => new Date(item.date).toLocaleDateString());
        const sales = data.map(item => item.totalSales);
        this.renderSalesChart(dates, sales);
        this.loading.sales = false;
      },
      error: (err) => {
        this.errors.sales = 'Failed to load sales data';
        this.loading.sales = false;
      }
    });
  }

  // Load and render top products (Bar Chart)
  loadProductsChart() {
    this.loading.topProducts = true;
    this.http.get<{ productName: string, quantitySold: number }[]>('http://localhost:8080/orders/top-products').subscribe({
      next: (data) => {
        const productNames = data.map(item => item.productName);
        const quantities = data.map(item => item.quantitySold);
        this.renderProductsChart(productNames, quantities);
        this.loading.topProducts = false;
      },
      error: (err) => {
        this.errors.topProducts = 'Failed to load product data';
        this.loading.topProducts = false;
      }
    });
  }

  renderSalesChart(labels: string[], data: number[]) {
    if (this.salesChart) {
      this.salesChart.destroy();
    }
    
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily Sales ($)',
          data: data,
          borderColor: '#C24641', 
          backgroundColor: 'rgba(194, 70, 65, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false } 
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: { 
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  }

  // Render Bar Chart (Top Selling Products)
  renderProductsChart(labels: string[], data: number[]) {
    if (this.productsChart) {
      this.productsChart.destroy();
    }
    
    const ctx = document.getElementById('productsChart') as HTMLCanvasElement;
    this.productsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Units Sold',
          data: data,
          backgroundColor: '#C24641', 
          borderColor: '#a03a36',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false } 
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: { 
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}
  

  