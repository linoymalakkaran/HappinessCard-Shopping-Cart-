import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoutingHelperService } from '../services/routing-helper.service';

@Component({
  templateUrl: '../templates/home.component.html'
})
export class HomeComponent implements OnInit{
  constructor (private route: ActivatedRoute, 
    private routingHelperService: RoutingHelperService) {    
  }

  ngOnInit(): void {
    var url = '';
    this.route.url.forEach((segment) => {
      url += segment;
    });
    this.routingHelperService.receiveRouteUrl(url);
  }
}