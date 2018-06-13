import { Component, OnInit, Input } from '@angular/core';
import { Venue, VenueStatusEnum } from '../../../_models/Venue';

@Component({
  selector: 'app-venue-card',
  templateUrl: './venue-card.component.html',
  styleUrls: ['./venue-card.component.css']
})
export class VenueCardComponent implements OnInit {
  @Input() venue: Venue;
  VenueStatusEnum = VenueStatusEnum;
  constructor() { }

  ngOnInit() {
  }

}
