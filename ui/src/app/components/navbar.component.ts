import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { OverlayToggleService } from '../services/overlay-toggle.service';
import { RoutingHelperService } from '../services/routing-helper.service';

@Component({
  selector: '.navbar-div',
  templateUrl: '../templates/navbar.component.html'
})
export class NavbarComponent implements OnDestroy{
  constructor(private overlayToggleService: OverlayToggleService,
    private routingHelperService: RoutingHelperService) {
      this.urlSubscription = this.routingHelperService.routeUrlAnnounced$.subscribe(
        (routeUrl) => {
          this.currentLink = routeUrl;
      });
  }

  overlayToggle: string = '';
  currentLink : string;

  urlSubscription: Subscription;

  toggleOverlay () {
    this.overlayToggleService.receiveOverlayToggle('true');
  }

   ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }
}
