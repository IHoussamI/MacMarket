import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/Auth.service/auth.service';
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
    }

    login() {
    this.errorMessage = ''; 

    const credentials = {
        email: this.email,
        password: this.password
    };

    this.authService.login(credentials).subscribe(
        (response: any) => {
            if (response) {
                this.router.navigate(['/home']); 
            }
        },
        (error: any) => {
            this.errorMessage = 'Login failed: ' + error.message; 
        }
    );
}

  
    }

