import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Auth.service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  repeatPassword = '';
  errorMessage = '';  

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMessage = '';

    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if (!this.firstname || !this.lastname || !this.email || !this.password || !this.repeatPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    const user = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password
    };

    this.authService.register(user).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error: any) => {
        this.errorMessage = 'Registration failed: ' + error.message;
      }
    );
  }
}
