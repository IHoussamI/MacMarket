import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout.component';
import { ProductsComponent } from './components/products/products.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { TestComponent } from './components/test/test.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AuthGuard } from './auth.guard';
import { ProtectedComponent } from './components/protected/protected.component';
import { RegisterComponent } from './Authentication/register/register.component';
import { CartsComponent } from './components/Cart/carts.component';
import { PaymentComponent } from './payment/payment.component';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: 'home', component: HomeLayoutComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'cart', component: CartsComponent },
      { path: 'login', component: LoginComponent },
      {path: 'payment', component:PaymentComponent},
      { path: 'register', component: RegisterComponent },
      { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] },
      { path: 'test', component: TestComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ]
  }
];
