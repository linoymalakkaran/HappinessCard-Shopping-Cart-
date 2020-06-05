import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { DocumentScrollService } from '../services/document-scroll.service';

@Component({
  selector: '.header-div',
  templateUrl: '../templates/header.component.html'
})
export class HeaderComponent implements OnDestroy {
  constructor ( private documentScrollService : DocumentScrollService) {
    this.documentScrollSubscription = documentScrollService.scrollHeightAnnounced$
      .subscribe((scrollHeight) => {
        this.documentScrollHeight = +scrollHeight;
      });
  }
  documentScrollSubscription : Subscription;
  documentScrollHeight: number = 0;

  ngOnDestroy () {
    this.documentScrollSubscription.unsubscribe();
  }
}