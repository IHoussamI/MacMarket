import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/Auth.service/auth.service';
import { HeroComponent } from "../hero/hero.component";

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  standalone:true,
  imports: [HeroComponent]
})
export class ProtectedComponent {

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
