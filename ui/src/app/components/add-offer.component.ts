import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import 'rxjs/add/operator/switchMap';

import Offer from '../model/offer';
import Category from '../model/category';
import OfferLocation from '../model/offer-location';
import { RoutingHelperService } from '../services/routing-helper.service';
import { OffersService } from '../services/offers.service';

import { service_url_prefix } from '../config/globals';
import FileInput from '../model/input-file';

declare var require: any;
let $ = require("jquery");
require('eonasdan-bootstrap-datetimepicker');
let moment = require('moment');

@Component({
  templateUrl: '../templates/add-offer.component.html',
  providers: [OffersService]
})
export class AddOfferComponent implements OnInit{
  constructor (private offersService: OffersService, 
    private route: ActivatedRoute, 
    private routingHelperService: RoutingHelperService,
    private location: Location) {    
  }

  offerId: number;

  imgUrlPrefix : string = service_url_prefix;
  offer: Offer = {title: '', 
    category: '', details: '', flip: false, id: -1, img: '', likes: 0, location: '', percent_off: -1,
    selected: false, valid_from: '', valid_till: ''
  };
  selectedCategoryId: number = 0;
  selectedLocationId: number = 0;
  offerLocations : OfferLocation[] = [{id:0, value:'Select location'}, {id: 1, value: 'Dubai Mall'},
    {id:2, value:'Deira City Center'}, {id:3, value:'Mirdif City Center'},
    {id:4, value:'Ibn Batuta Mall'}, {id:5, value:'Emirates Mall'}];

  categories: Category[] = [{id:0, value:'Select category'},{id:1, value:'Travel'},
  {id:2, value:'Fashion'}, {id:3, value:'Automotive'},
  {id:4, value:'Food and Drink'}, {id:5, value:'Education and Learning'},
  {id:6, value:'Liesure'}, {id:7, value:'Mind and Body'},
  {id:8, value:'Services'}, {id:9, value:'Shopping'},
  {id:10, value:'Tickets'}];

  valid_from: string = moment().format('DD-MMM-YYYY');
  valid_till: string = moment().format('DD-MMM-YYYY');

  formData:FormData = new FormData();
  file: File;


  initializeDatePicker (): void {
    $('#datetimepicker1').datetimepicker({
      format: 'DD-MMM-YYYY'
    });
    $('#datetimepicker2').datetimepicker({
      format: 'DD-MMM-YYYY'
    });
  }

  ngOnInit(): void {
    var url = '';
    this.route.url.forEach((segment) => {
      url += segment;
    });
    this.routingHelperService.receiveRouteUrl(url);

    this.route.params
    .subscribe((params: Params) => {
      this.offerId = +params['id'];
      this.offersService.getOfferById(+params['id']).then((_offers) => {
        if (_offers && _offers['length']) {
          this.offer = _offers[0];
          this.selectedCategoryId = this.categories.
            find((_category) => {
              return (_category.value === this.offer.category);
            }).id;
          this.selectedLocationId = this.offerLocations.
          find((_offerlocation) => {
            return (_offerlocation.value === this.offer.location);
          }).id;
          this.valid_from = moment(this.offer.valid_from, 'YYYY-MM-DD').format('DD-MMM-YYYY');
          this.valid_till = moment(this.offer.valid_till, 'YYYY-MM-DD').format('DD-MMM-YYYY');
        }        
      }).catch((err) => {
        console.log(err);
      });
    });

    this.initializeDatePicker();
  }

  selectCategory (): void {
    if (this.selectedCategoryId) {
      this.offer.category = this.categories.find((_category) => {
        return (+this.selectedCategoryId === _category.id);
      }).value;
    }
  }

  selectOfferLocation (): void {
    if (this.selectedLocationId) {
      this.offer.location = this.offerLocations.find((_offerlocation) => {
        return (+this.selectedLocationId === _offerlocation.id);
      }).value;
    }
  }

  validFromBlur (val): void {
    this.offer.valid_from = moment(val, 'DD-MMM-YYYY').format('YYYY-MM-DD');
  }

  validTillBlur (val): void {
    this.offer.valid_till = moment(val, 'DD-MMM-YYYY').format('YYYY-MM-DD');
  }

  goBack(): void {
    this.location.back();
  }

  getFileFromInput(event: Event) {
    let fileList: FileList = event.target['files'];
    if(fileList.length > 0) {
        this.file = fileList[0];
        this.offer.img = this.file.name;
        this.formData.append('offer-image', this.file, this.file.name);
    }
  }

  addUpdateOffer(): void {
    this.formData.append('id', this.offer.id.toString());
    this.formData.append('title', this.offer.title);
    this.formData.append('details', this.offer.details);
    this.formData.append('img', this.offer.img);
    this.formData.append('location', this.offer.location);
    this.formData.append('category', this.offer.category);
    this.formData.append('valid_from', this.offer.valid_from);
    this.formData.append('valid_till', this.offer.valid_till);
    this.formData.append('percent_off', this.offer.percent_off.toString());
    if (this.offerId === -1) {
      this.offersService.createOffer(this.formData)
      .then((response) => {
        console.log(response);
        this.goBack();
      })
      .catch((err)=> {
        console.log(err);
      });
    } else {
      this.offersService.updateOffer(this.formData)
      .then((response) => {
        console.log(response);
        this.goBack();
      })
      .catch((err)=> {
        console.log(err);
      });
    }
  }

}