import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  totalAmount: number = 0; 
   selectedPayment: string = '';
  showPaypalButton: boolean = false;
  cardholderName: string = '';
  cardNumber: string = '';
  expiryMonth: string = '';
  expiryYear: string = '';
  cvv: string = '';

  months: string[] = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  years: number[] = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);
  

  ngOnInit() {
    const storedAmount = localStorage.getItem('totalAmount');
    if (storedAmount) {
      this.totalAmount = parseFloat(storedAmount);
    } else {
      this.totalAmount = 0;
    }
  }
  togglePaypalButton() {
    this.showPaypalButton = this.selectedPayment === 'paypal';
  }

  
  confirmPayment() {
    if (this.selectedPayment === 'credit') {
      console.log('Processing credit card payment...');
    } else if (this.selectedPayment === 'paypal') {
      this.goToPaypal();
    }
  }

  goToPaypal() {
    window.location.href = 'https://www.paypal.com'; 
  }
}




