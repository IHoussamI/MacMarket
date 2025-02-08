import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../components/hero/hero.component';

@Component({
  selector: 'app-home-layout',
  template: `
    <app-hero></app-hero>
  `,
  standalone: true,
  imports: [RouterModule, HeroComponent]
})
export class HomeLayoutComponent {}
