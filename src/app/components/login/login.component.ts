import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Auth.service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    email = '';
    password = '';
    errorMessage: string = '';
    firstName: string | null = null;
    rememberMe = false;
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {
      this.isLoggedIn = this.authService.isAuthenticated();
      if (this.isLoggedIn) {
        // Redirect user if needed
      }
    }

    login() {
    this.errorMessage = ''; 

    const credentials = {
        email: this.email,
        password: this.password
    };

    console.log('Attempting to log in with credentials:', credentials); // Log credentials

    this.authService.login(credentials).subscribe(
        (response: any) => {
            console.log('Login response received:', response); // Log the response

            if (response.token) {
                localStorage.setItem('jwtToken', response.token); // Save token
                console.log('Token saved to localStorage:', response.token); // Log token
            } else {
                console.error('No token found in response'); // Log error if no token
            }

            localStorage.setItem('firstName', response.firstname); // Save first name
            console.log('First name saved to localStorage:', response.firstname); // Log first name

            this.router.navigate(['/home']); // Redirect to home
        },
        (error: any) => {
            console.error('Login failed with error:', error); // Log error
            this.errorMessage = 'Login failed: ' + error.message; // Show error message
        }
    );
}

  
    }

