// src/app/protected/protected.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Auth.service/auth.service';
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  standalone:true,
  imports: [HomeComponent]
})
export class ProtectedComponent {

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
