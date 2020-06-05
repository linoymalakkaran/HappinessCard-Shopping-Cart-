import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Subscription }   from 'rxjs/Subscription';

import Offer from '../model/offer';

import { OffersService } from '../services/offers.service';
import { SearchKeyService } from '../services/search-key.service';
import { DocumentScrollService } from '../services/document-scroll.service';

import { ctxpath, service_url_prefix } from '../config/globals';

@Component({
  selector: '.result',
  templateUrl: '../templates/result.component.html',
  providers: [OffersService]
})
export class ResultComponent implements OnInit, OnDestroy{
  
  constructor(private sanitizer:DomSanitizer,
     private offersService: OffersService,
     private searchKeyService: SearchKeyService,
     private documentScrollService : DocumentScrollService) {
      this.searchKeySubscription = searchKeyService.searchKeyAnnounced$.subscribe(
        (searchKey) => {
          this.filterArgs = searchKey;
      });
      this.categorySubscription = searchKeyService.categoryAnnounced$.subscribe(
        (category) => {
          this.categoryArgs = category;
      });
      this.documentScrollSubscription = documentScrollService.scrollHeightAnnounced$
      .subscribe((scrollHeight) => {
        this.documentScrollHeight = +scrollHeight;
      });
  };
  searchKeySubscription: Subscription;
  categorySubscription: Subscription;
  documentScrollSubscription : Subscription;
  documentScrollHeight: number = 0;
  offers: Offer[];
  filterArgs: string = '';
  categoryArgs: string = '';

  getSanitizedBackgroundImageUrl (img: string) {
    return this.sanitizer
      //.bypassSecurityTrustStyle(`url('${ctxpath}/src/images/cards/${img}')`);
      .bypassSecurityTrustStyle(`url('${service_url_prefix}${ctxpath}/images?name=${img}&size=300x180')`);
  }

  ngOnInit() {
    this.offersService.getOffers().then((_offers) => { this.getOffers(_offers) });
  }

  flipCard (event: Event, cardId: number) {
    if (['BUTTON', 'I'].indexOf(event.srcElement.nodeName) === -1) {
      let offer = this.offers.find((offer) => offer.id === cardId);
      offer.flip = !offer.flip;
    }
  }

  getOffers (_offers: Offer[]) {
    this.offers = _offers;
  }

  fullHeart (event: Event) {
    event.srcElement.classList.remove('fa-heart-o');
    event.srcElement.classList.add('fa-heart');
  }

  normalHeart (event: Event) {
    event.srcElement.classList.remove('fa-heart');
    event.srcElement.classList.add('fa-heart-o');
  }

  fullLike (event: Event) {
    event.srcElement.classList.remove('fa-thumbs-o-up');
    event.srcElement.classList.add('fa-thumbs-up');
  }

  normalLike (event: Event) {
    event.srcElement.classList.remove('fa-thumbs-up');
    event.srcElement.classList.add('fa-thumbs-o-up');
  }

  ngOnDestroy() {
    this.searchKeySubscription.unsubscribe();
    this.categorySubscription.unsubscribe();
    this.documentScrollSubscription.unsubscribe();
  }
}
