import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Subscription }   from 'rxjs/Subscription';

import Carousel from '../model/carousel';

import { ctxpath } from '../config/globals';

import { SearchKeyService } from '../services/search-key.service';
import { DocumentScrollService } from '../services/document-scroll.service';

declare var require: any;

@Component({
  selector: '.carousel',
  templateUrl: '../templates/carousel.component.html'
})
export class CarouselComponent implements OnInit, OnDestroy {
    constructor(private sanitizer:DomSanitizer,
        private searchKeyService: SearchKeyService,
        private documentScrollService : DocumentScrollService){
            this.searchKeySubscription = searchKeyService.searchKeyAnnounced$.subscribe(
                (searchKey) => {
                this.searchKey = searchKey;
            });
            this.documentScrollSubscription = documentScrollService.scrollHeightAnnounced$
            .subscribe((scrollHeight) => {
                this.documentScrollHeight = +scrollHeight;
            });
        };
    
    searchKeySubscription: Subscription;
    documentScrollSubscription : Subscription;
    documentScrollHeight: number = 0;
    searchKey: string = '';

    carousel: Carousel = {
	    images : ['1.jpg', '2.jpg', '3.jpg'],
	    previous: 0,
	    current : 0
    };

    intervalId : number;
    overlay_visibility: boolean = true;

    getSanitizedBackgroundImageUrl () {
        return this.sanitizer.
            bypassSecurityTrustStyle(`url('${ctxpath}/src/images/carousel/${this.carousel.current+1}.jpg')`);
    }

    slideLeft (event: Event) {
        this.pauseCarouselForClick(event);
        if (this.carousel.current === 0) {
            this.carousel.current = this.carousel.images.length - 1;
        } else {
            this.carousel.current -= 1;
        }
        this.repaintOverlay();
    };

    slideRight (event: Event) {
        this.pauseCarouselForClick(event);
        if (this.carousel.current === (this.carousel.images.length - 1)) {
            this.carousel.current = 0;
        } else {
            this.carousel.current += 1;
        }
        this.repaintOverlay();
    };

    repaintOverlay () {
        this.overlay_visibility = false;
        window.setTimeout(() => {
            this.overlay_visibility = true;
        }, 100);
    };

    pauseCarouselForClick (event: Event) {
        if (event) {
            window.clearInterval(this.intervalId);
            window.setTimeout(() => {
                this.initCarousel();
            }, 1000);
        }
    };

    ngOnInit () : void {
        this.initCarousel();
    };

    initCarousel () {
        this.intervalId = window.setInterval(() => {
            this.slideRight(null);
        }, 5000 );
    };

    ngOnDestroy() {
        this.searchKeySubscription.unsubscribe();
        this.documentScrollSubscription.unsubscribe();
    }
}
