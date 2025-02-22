import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Auth.service/auth.service'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] 
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  firstName: string | null = null;
  isLoggedIn: boolean = false;
  dropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.firstName = localStorage.getItem('firstName');
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
    this.isLoggedIn = false;
    this.firstName = null;
    this.router.navigate(['/login']);
    console.log('Logged out');
        this.dropdownOpen = false;
  }
}