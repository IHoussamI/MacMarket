  import { bootstrapApplication } from '@angular/platform-browser';
  import { AppComponent } from './app/app.component';
  import { importProvidersFrom } from '@angular/core';
  import { HttpClientModule } from '@angular/common/http';
  import { provideRouter } from '@angular/router';
  import { ProductsService } from './services/products.service';
  import { routes } from './app/app-routing.module';
  import { register as registerSwiperElements } from 'swiper/element/bundle';
  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

  registerSwiperElements();
  platformBrowserDynamic();
  
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(HttpClientModule),
      provideRouter(routes),
      ProductsService
    ]
  }).catch(err => console.error(err));
