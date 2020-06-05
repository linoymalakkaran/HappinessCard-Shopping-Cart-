import { Injectable } from '@angular/core';

//declare var require: any;

import Offer from '../model/offer';

import fetch from 'isomorphic-fetch';

import { service_url_prefix } from '../config/globals';

@Injectable()
export class OffersService {
    
    //offers: Offer[]  = require('../model/data2.json');
    offers: Offer[];

    /*
    getOffers (): Promise<Offer[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.offers.forEach((offer) => {
                    offer.flip = false;
                });
                resolve(this.offers);
            }, 200);
        });
    }
    */

    getOffers () : Promise<Offer[]> {
        return fetch(`${service_url_prefix}/test_happinesscard/offers`, {
			method: 'GET'
		}).
        then((response) => {
            return response.json();
        });
    }

    getOfferById (offerId) : Promise<Offer> {
        return fetch(`${service_url_prefix}/test_happinesscard/offers?id=${offerId}`, {
			method: 'GET'
		}).
        then((response) => {
            return response.json();
        });
    }

    createOffer (formData: FormData) {
        return fetch(`${service_url_prefix}/test_happinesscard/offers/create`, {
			method: 'POST',
            body: formData
		}).
        then((response) => {
            return response.json();
        });
    }

    updateOffer (formData: FormData) {
        return fetch(`${service_url_prefix}/test_happinesscard/offers/update`, {
			method: 'POST',
            body: formData
		}).
        then((response) => {
            return response.json();
        });
    } 

    deleteOffer (offers: Offer[]) {
        let formData : FormData = new FormData();
        formData.append('offers', JSON.stringify(offers));
         return fetch(`${service_url_prefix}/test_happinesscard/offers/delete`, {
			method: 'POST',
            body: formData
		}).
        then((response) => {
            return response.json();
        });
    }
}
