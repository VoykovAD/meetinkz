import { Component, OnInit } from '@angular/core';
import { Venue } from '../../../_models/Venue';
import { VenueService } from './../../../_services/venue.service';
import { AlertifyService } from './../../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-venue-detail',
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./venue-detail.component.css']
})
export class VenueDetailComponent implements OnInit {
  venue: Venue;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private venueService: VenueService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.venue = data['venue'];
    });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];

    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.venue.photos.length; i++) {
      imageUrls.push({
        small: this.venue.photos[i].url,
        medium: this.venue.photos[i].url,
        big: this.venue.photos[i].url,
        description: this.venue.photos[i].description
      });
    }
    return imageUrls;
  }

  selectTab(tabId: number) {
    // this.venuesTabs.tabs[tabId].active = true;
  }

}
