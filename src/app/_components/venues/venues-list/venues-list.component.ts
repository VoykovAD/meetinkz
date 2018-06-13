import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Venue } from '../../../_models/Venue';
import { VenueService } from './../../../_services/venue.service';

@Component({
  selector: 'app-venues-list',
  templateUrl: './venues-list.component.html',
  styleUrls: ['./venues-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VenuesListComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  venues: Venue[];
  venueParams: any = {
    name: '',
    id: '',
    status: '',
    locale: ''
  };
  currentPage = 1;
  pageLimit = 12;
  loading = false;
  totalItems: number;
  idSearchString = '';
  titleSearchString = '';
  constructor(
    private venueService: VenueService
  ) {}

  ngOnInit() {
    this.fetchVenues();
  }

  fetchVenues() {
    this.blockUI.start('Loading...'); // Start blocking
    this.loading = true;
console.log(this.venueParams);
    this.venueService.getVenues(this.currentPage, this.pageLimit, this.venueParams).subscribe((response) => {
      this.venues = response.result;
      this.totalItems = response.pagination.totalItems;
    }, () => {
      alert('Error while getting venues');
    }, () => {
      this.loading = false;
      this.blockUI.stop();
    });
  }

  pageChanged(pageNumber: number) {
    this.currentPage = pageNumber;
    this.fetchVenues();
  }

  searchTerms() {
    this.currentPage = 1;
    this.fetchVenues();
  }
}
