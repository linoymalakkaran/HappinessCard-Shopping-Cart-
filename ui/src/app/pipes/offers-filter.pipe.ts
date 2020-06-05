import { Pipe, PipeTransform } from '@angular/core';

import Offer from '../model/offer';

@Pipe({name: 'offersFilter'})
export class OffersFilterPipe implements PipeTransform {
  transform(offers: Offer[], searchKey: string, category: string): Offer[] {
    let filterdOffers = offers;
    if (searchKey) {
      filterdOffers = offers.filter((offer) => {
        return (
            (offer.details.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1) || 
            (offer.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1)
        );
      });
    }
    if (category) {
        filterdOffers = filterdOffers.filter((offer) => {
          return (offer.category === category);
        }); 
    }
    return filterdOffers;
  }
}
