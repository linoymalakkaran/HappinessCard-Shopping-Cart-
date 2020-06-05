import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SearchKeyService } from '../services/search-key.service';
import { RoutingHelperService } from '../services/routing-helper.service';

@Component({
  selector: '.search',
  templateUrl: '../templates/search.component.html'
})
export class SearchComponent implements OnDestroy {

  urlSubscription: Subscription;
  focus = false;
  currentLink: string;

  constructor(private searchKeyService: SearchKeyService,
    private routingHelperService: RoutingHelperService) {
    this.urlSubscription = this.routingHelperService.routeUrlAnnounced$.subscribe(
      (routeUrl) => {
        this.currentLink = routeUrl;
      });
  }

  searchItems(searchKey) {
    this.searchKeyService.receiveSearchKey(searchKey);
    this.focus = (true && searchKey);
  }

  searchCategory(category) {
    this.searchKeyService.receiveCategory(category);
  }

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }
}
