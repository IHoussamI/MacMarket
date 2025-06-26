import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/Auth.service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] 
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpen = false;
  firstName: string | null = null;
  isLoggedIn: boolean = false;
  dropdownOpen: boolean = false;
  isAdmin: boolean = false;
  private userStatusSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userStatusSubscription = this.authService.userStatus$.subscribe(status => {
      this.isLoggedIn = status.isLoggedIn;
      this.firstName = status.firstName;
      this.isAdmin = status.role === 'ADMIN';
    });
  }

  ngOnDestroy() {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen; 
}
  closeMenu() {
    this.menuOpen = false;
  }
  closeDropdown(){
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    const clickedInside = targetElement.closest('.navbar');

    if (!clickedInside) {
      this.closeMenu();
    }
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.navbar')) {
      this.menuOpen = false;
    }

    if (!target.closest('.dropdown') && !target.closest('.greeting-container')) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.dropdownOpen = false;
  }
}