import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class DocumentScrollService {

    private scrollHeightAnnounced = new Subject<string>();
    private scrollHeightReceived = new Subject<string>(); 

    scrollHeightAnnounced$ = this.scrollHeightAnnounced.asObservable();
    scrollHeightReceived$ = this.scrollHeightReceived.asObservable();

    announceScrollHeight(scrollHeight: string) {
        this.scrollHeightAnnounced.next(scrollHeight);
    }
    receiveScrollHeight(scrollHeight: string) {
        this.scrollHeightReceived.next(scrollHeight);
    }
}
