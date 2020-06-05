import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SearchKeyService {

    private searchKeyAnnounced = new Subject<string>();
    private searchKeyReceived = new Subject<string>();

    private categoryAnnounced = new Subject<string>();
    private categoryReceived = new Subject<string>();

    searchKeyAnnounced$ = this.searchKeyAnnounced.asObservable();
    searchKeyReceived$ = this.searchKeyReceived.asObservable();

    categoryAnnounced$ = this.categoryAnnounced.asObservable();
    categoryReceived$ = this.categoryReceived.asObservable();

    announceSearchKey(searchKey: string) {
        this.searchKeyAnnounced.next(searchKey);
    }
    receiveSearchKey(searchKey: string) {
        this.searchKeyReceived.next(searchKey);
    }
    announceCategory(category: string) {
        this.categoryAnnounced.next(category);
    }
    receiveCategory(category: string) {
        this.categoryReceived.next(category);
    }
}
