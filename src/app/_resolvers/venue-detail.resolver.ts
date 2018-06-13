import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Venue } from '../_models/Venue';
import { Injectable } from '@angular/core';
import { VenueService } from './../_services/venue.service';
import { AlertifyService } from './../_services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class VenueDetailResolver implements Resolve<Venue> {
  constructor(
    private venueService: VenueService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Venue> {
      return this.venueService.getVenue(route.params['id']).catch(error => {
          this.alertify.error('Error getting data');
          this.router.navigate(['/home']);
          return Observable.of(null);
      });
  }
}
