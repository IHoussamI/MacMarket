import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  submissionStatus: 'success' | 'error' | 'none' = 'none';

  constructor(private http: HttpClient) {}

  submitForm() {
    this.http.post('http://localhost:8080/api/contact', this.form).subscribe(
        (response: any) => { 
            if (response.message) {
                this.submissionStatus = 'success';
                this.resetForm();
            } else {
                this.submissionStatus = 'error';
            }
        },
        error => {
            this.submissionStatus = 'error';
        }
    );
}

  resetForm() {
    this.form = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
}
