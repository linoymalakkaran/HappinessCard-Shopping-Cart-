import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoutingHelperService } from '../services/routing-helper.service';

import { OffersService } from '../services/offers.service';

import { service_url_prefix } from '../config/globals';

import Offer from '../model/offer';

@Component({
  templateUrl: '../templates/admin.component.html',
  providers: [OffersService]
})
export class AdminComponent implements OnInit{
  constructor (private route: ActivatedRoute, 
    private routingHelperService: RoutingHelperService,
    private offersService: OffersService) {    
  }

  offers: Offer[];
  imgUrlPrefix : string = service_url_prefix;
  all_selected: boolean = false;
  deactivate_add: boolean = false;
  deactivate_edit: boolean = true;
  deactivate_delete: boolean = true;
  editID : number = -1;
  deleteIDs: number[] = [];

  ngOnInit(): void {
    var url = '';
    this.route.url.forEach((segment) => {
      url += segment;
    });
    this.routingHelperService.receiveRouteUrl(url);
    this.offersService.getOffers().then((_offers) => { this.getOffers(_offers) });
  }

  getOffers (_offers: Offer[]) {
    this.offers = _offers;
  }

  selectOffer (offerId) {
    let offer : Offer = this.offers.filter((o) => {
      return (o.id === offerId);
    })[0];
    offer.selected = !offer.selected;
    this.activateButtons();
  }

  selectAllOffers () {
    this.all_selected = !this.all_selected;
    this.offers.forEach( (offer) => {
      offer.selected = this.all_selected;
    });
    this.activateButtons();
  }

  activateButtons () {
    this.deactivate_add = false;
    this.deactivate_edit = true;
    this.deactivate_delete = true;

    let count: number = 0;
    this.editID = -1;
    this.deleteIDs = [];

    this.offers.forEach( (offer) => {
      if (offer.selected) {
        count += 1;
        this.editID = offer.id;
        this.deleteIDs.push(offer.id);
      }
    });

    if (count > 0) {
      this.deactivate_add = true;
      this.deactivate_edit = false;
      this.deactivate_delete = false;
    }
    
    if (count > 1) {
      this.deactivate_add = true;
      this.deactivate_edit = true;
      this.deactivate_delete = false;
    }
  }

  deleteOffers () {
    let del_offers: Offer[] = this.offers.filter((offer) => {
      return offer.selected;
    });

    this.offersService.deleteOffer(del_offers).then((response) => {
      console.log(response);
      this.offersService.getOffers().then((_offers) => { this.getOffers(_offers) });
    });
  }

  
}