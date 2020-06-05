import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from '../components/app.component';
import { HeaderComponent } from '../components/header.component';
import { MobileOverlayComponent } from '../components/mobile.overlay.component';
import { ResultComponent } from '../components/result.component';
import { FooterComponent } from '../components/footer.component';
import { NavbarComponent } from '../components/navbar.component';
import { SearchComponent } from '../components/search.component';
import { CarouselComponent } from '../components/carousel.component';
import { LogoBarComponent } from '../components/logo.bar.component';
import { HomeComponent } from '../components/home.component';
import { AdminComponent } from '../components/admin.component';
import { AddOfferComponent } from '../components/add-offer.component';

import { OffersFilterPipe } from '../pipes/offers-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    MobileOverlayComponent,
    HeaderComponent,
    ResultComponent,
    FooterComponent,
    NavbarComponent,
    SearchComponent,
    CarouselComponent,
    OffersFilterPipe,
    LogoBarComponent,
    HomeComponent,
    AdminComponent,
    AddOfferComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
