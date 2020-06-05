import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class OverlayToggleService {

    private overlayToggleAnnounced = new Subject<string>();
    private overlayToggleReceived = new Subject<string>(); 

    overlayToggleAnnounced$ = this.overlayToggleAnnounced.asObservable();
    overlayToggleReceived$ = this.overlayToggleReceived.asObservable();

    announceOverlayToggle(overlayToggle: string) {
        this.overlayToggleAnnounced.next(overlayToggle);
    }
    receiveOverlayToggle(overlayToggle: string) {
        this.overlayToggleReceived.next(overlayToggle);
    }
}
