import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RoutingHelperService {

    private routeUrlAnnounced = new Subject<string>();
    private routeUrlReceived = new Subject<string>();

    routeUrlAnnounced$ = this.routeUrlAnnounced.asObservable();
    routeUrlReceived$ = this.routeUrlReceived.asObservable();

    announceRouteUrl(routeUrl: string) {
        this.routeUrlAnnounced.next(routeUrl);
    }
    receiveRouteUrl(routeUrl: string) {
        this.routeUrlReceived.next(routeUrl);
    }
}
