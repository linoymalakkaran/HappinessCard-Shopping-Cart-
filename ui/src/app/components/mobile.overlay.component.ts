import { Component, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { OverlayToggleService } from '../services/overlay-toggle.service';

@Component({
  selector: '.mobile-overlay-container',
  templateUrl: '../templates/mobile.overlay.component.html'
})
export class MobileOverlayComponent implements OnDestroy{

  constructor(private overlayToggleService: OverlayToggleService) {
    this.overlayToggleSubscription = overlayToggleService.overlayToggleAnnounced$.subscribe(
        (overlayToggle) => {
          this.showOverlay = overlayToggle;
      });
  }
  overlayToggleSubscription: Subscription;

  showOverlay : string = '';

  hideOverlay () {
    if (this.showOverlay) {
      this.showOverlay = '';
    } else {
      this.showOverlay = 'true';
    }
  }

  ngOnDestroy() {
    this.overlayToggleSubscription.unsubscribe();
  }
}
