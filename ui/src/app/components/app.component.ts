import { Component, HostListener } from '@angular/core';

declare var require: any;

import { SearchKeyService } from '../services/search-key.service';
import { OverlayToggleService } from '../services/overlay-toggle.service';
import { DocumentScrollService } from '../services/document-scroll.service';
import { RoutingHelperService } from '../services/routing-helper.service';

@Component({
  selector: '.app-root',
  templateUrl: '../templates/app.component.html',
  providers: [SearchKeyService, 
    OverlayToggleService,
    DocumentScrollService,
    RoutingHelperService],
  styles: [require('../../css/font-awesome.css').toString(),
    require('../../../node_modules/bootstrap/dist/css/bootstrap.css').toString(),
    require('../../../node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css').toString()]
})
export class AppComponent {

  constructor(private searchKeyService: SearchKeyService,
    private overlayToggleService: OverlayToggleService,
    private documentScrollService: DocumentScrollService,
    private routingHelperService: RoutingHelperService
    ) {
    searchKeyService.searchKeyReceived$.subscribe((searchKey) => {
      searchKeyService.announceSearchKey(searchKey);
    });
    searchKeyService.categoryReceived$.subscribe((category) => {
      searchKeyService.announceCategory(category);
    });
    overlayToggleService.overlayToggleReceived$.subscribe((overlayToggle) => {
      overlayToggleService.announceOverlayToggle(overlayToggle);
    });
    documentScrollService.scrollHeightReceived$.subscribe((scrollHeight) => {
      documentScrollService.announceScrollHeight(scrollHeight);
    });
    routingHelperService.routeUrlReceived$.subscribe((routeUrl) => {
      routingHelperService.announceRouteUrl(routeUrl);
    });
  }

  documentScrollHeight: number = 0;

  @HostListener('document:scroll', ['$event'])
  onScroll (event: Event) {
    this.documentScrollService.receiveScrollHeight(''+document.body.scrollTop);
  }
}
