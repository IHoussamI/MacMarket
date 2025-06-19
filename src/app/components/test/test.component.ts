import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [ FormsModule,CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class TestComponent {}