import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { TestComponent } from './components/test/test.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ProtectedComponent } from './components/protected/protected.component';
import { CartsComponent } from './components/Cart/carts.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/DASHBOARD/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from '../services/auth-guard/auth.guard';
import { DashboardManagementComponent } from './components/DASHBOARD/dashboard-management/dashboard-management.component';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: 'home', component: HomeLayoutComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'cart', component: CartsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'dashboard-management', component: DashboardManagementComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] },
      { path: 'test', component: TestComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ]
  }
];
