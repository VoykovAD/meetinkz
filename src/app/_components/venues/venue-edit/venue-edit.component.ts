import { Errorhelper } from './../../../_helpers/error-helper';
import { environment } from './../../../../environments/environment';

// import { environment } from '../../../../../src/environments/environment';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Photo } from '../../../_models/Photo';
import { AlertifyService } from '../../../_services/alertify.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ActivityTime, PricingDetails, Venue, VenueSeatingOptionEnum, VenueStatusEnum } from '../../../_models/Venue';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CurrencyEnum, LanguagesEnum, CountryCodeEnum } from '../../../_models/general.interface';
import { MapsAPILoader, AgmMap } from '@agm/core';
import {} from '@types/googlemaps';
import { FileUploaderComponent } from '../../file-uploader/file-uploader.component';
import { FileItem } from 'ng2-file-upload';
import { VenueService } from '../../../_services/venue.service';
import { zip } from 'rxjs/observable/zip';
import { LocationService, ParsedAddress } from '../../../_services/location.service';
import { VenueEditForm } from './venue-edit.interface';
import { VenueEditService } from './venue-edit.service';


@Component({
  selector: 'app-venue-edit',
  templateUrl: './venue-edit.component.html',
  styleUrls: ['./venue-edit.component.css'],
  providers: [VenueEditService]
})
export class VenueEditComponent implements OnInit {
  venue: Venue;
  form: FormGroup;
  host = environment.meetinkzWebSiteHost;
  LanguagesEnum = LanguagesEnum;
  CurrencyEnum = CurrencyEnum;
  VenueStatusEnum = VenueStatusEnum;
  CountryCodeEnum = CountryCodeEnum;
  mapSettings = {
    zoom: 14,
    latitude: 32.0818702,
    longitude: 34.7805490
  };
  searchControl: FormControl;
  venueId: number;
  editMode = false;
  loading = false;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('search') public searchElementRef: ElementRef;
  @ViewChild('agmMap') agmMap: AgmMap;
  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  amenetiesList = this.venueEditService.amenetiesList;
  categories = this.venueEditService.venueCategoriesList;
  seatingOptions = this.venueEditService.seatingOptions;
  // navigationSubscription;

  constructor(
    private sanitizer: DomSanitizer,
    private venueEditService: VenueEditService,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private venueService: VenueService,
    private mapsAPILoader: MapsAPILoader,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private errorhelper: Errorhelper
  ) {

    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     this.loadVenue();
    //   }
    // });

    this.venueId = this.activatedRoute.snapshot.params.id;
    this.editMode = !!this.venueId;
    this.searchControl = new FormControl();
    this.form = this.fb.group(this.venueEditService.venueFormGroup);

    this.mapsAPILoader.load().then(() => {
      this.agmMap.triggerResize();

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: []
      });

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return this.alertify.error('Error while fetching google place id');
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          this.mapSettings.latitude = lat;
          this.mapSettings.longitude = lng;
          this.agmMap.triggerResize();

          const parsedAddress = this.locationService.parseGooglePlaceAddress(place.address_components);
          this.googleAddressChanged(parsedAddress, { lat, lng } );
        });
      });
    });
  }

  get formData() { return this.form.get('activityTimes'); }

  googleAddressChanged(address: ParsedAddress, { lat, lng }) {
    console.log('googleAddressChanged: ', address);
    let fullAddress = '';
    if (address.street) {
      fullAddress = address.street;
      if (address.streetNum) {
        fullAddress += ' ' + address.streetNum;
      }
    } else if (address.neighborhood) {
      fullAddress = address.neighborhood;
    }
    fullAddress += ', ' + address.city;

    this.form.get('address').patchValue({
      lat: lat,
      lon: lng,
      // fulladdress: address.name || `${address.street} ${address.streetNum || ''}, ${address.city} `,
      fulladdress: fullAddress,
      city: address.city,
      street: address.street,
      country: address.countryShort,
      countryFullName: address.country
    });

    this.form.get('address').markAsDirty();
  }

  ngOnInit() {
   this.loadVenue();
  }

  loadVenue() {
    console.log('loading venue');
    if (this.venueId && this.editMode) {
      this.venueService.getVenue(this.venueId).subscribe((response) => {
        this.venue = response;
        this.loadVenueForEdit(this.venue);
      }, () => {
        this.alertify.error('Error getting data');
      });
    } else {
      if (this.activatedRoute.snapshot.queryParams.venueData) {
        try {
          const parsedData = JSON.parse(this.activatedRoute.snapshot.queryParams.venueData);
          this.form.patchValue(parsedData);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  get getActivityTimesArray() {
    return this.form.get('activityTimes') as FormArray;
  }

  getActivityTime(activity?: ActivityTime) {
    return this.fb.group({
      day: activity ? Number(activity.day) : '',
      openTime: activity ? Number(activity.openTime) : 10,
      closeTime: activity ? Number(activity.closeTime) : 18
    });
  }

  get dayTimes() {
    const times = [];
    for (let i = 0; i < 24; i++) {
      times.push(i);
      times.push(i + .5);
    }

    return times;
  }

  removeActivityTime(index: number) {
    this.getActivityTimesArray.removeAt(index);
    this.getActivityTimesArray.markAsDirty();
  }

  addActivityTime() {
    const prev = this.getActivityTimesArray.at(this.getActivityTimesArray.length - 1);
    if (prev) {
      let newDay = 0;
      if (Number(prev.get('day').value) < 6) {
        newDay = Number(prev.get('day').value) + 1;
      }

      this.getActivityTimesArray.push(this.getActivityTime({
        day: newDay,
        openTime: prev.get('openTime').value,
        closeTime: prev.get('closeTime').value,
      }));
    } else {
      this.getActivityTimesArray.push(this.getActivityTime({
        day: 1,
        openTime: 8,
        closeTime: 20,
      }));
    }

    this.form.get('activityTimes').markAsDirty();
  }

  loadVenueForEdit(venue: Venue) {
    console.log('loading venue data: ', venue);
    console.log(this.form);
    this.form.get('details').patchValue({
      extraServicesText: venue.extraServicesText,
      roomSizeSqaureMeters: venue.roomSizeSqaureMeters,
      comments: venue.comments,
      status: venue.status,
      cateringDetails: venue.cateringDetails,
      cateringOptions: venue.cateringOptions,
      maxParticipants: venue.maxParticipants,
      name: venue.name,
      email: venue.email,
      about: venue.about,
      realName: venue.realName,
      phoneNumber: venue.phoneNumber,
      locale: venue.locale,
      contactPersonName: venue.contactPersonName
    });

    this.form.get('address').patchValue({
      fulladdress: venue.fullAddress,
      lat: venue.lat,
      lon: venue.lon,
      city: venue.city,
      country: venue.country,
      countryFullName: venue.countryFullName,
      directions: venue.directions,
      directionsToDisplay: venue.directionsToDisplay
    });

    if (venue.pricingDetails) {
      this.form.get('pricing').patchValue({
        id: venue.pricingDetails.id,
        refundPolicyOption: venue.pricingDetails.refundPolicyOption,
        refundPolicyOptionText: venue.pricingDetails.refundPolicyOptionText,
        currency: venue.pricingDetails.currency,
        pricePerHour_WithoutVAT: venue.pricingDetails.pricePerHour_WithoutVAT,
        minBookingHours: venue.pricingDetails.minBookingHours,
        extraDayPrice: venue.pricingDetails.extraDayPrice,
        halfDayPrice: venue.pricingDetails.halfDayPrice,
        fullDayPrice: venue.pricingDetails.fullDayPrice,
        termsAndConditions: venue.pricingDetails.termsAndConditions
      });
    }

    if (venue.lon) {
      this.mapSettings.longitude = venue.lon;
      this.mapSettings.latitude = venue.lat;
    }

    if (venue.activityTimes) {
      // make sure activity times array is empty
      // for (let index = 0; index < this.getActivityTimesArray.length; index++) {
      //   this.removeActivityTime(index);
      // }
      this.clearFormArray(this.getActivityTimesArray);
      for (const activity of venue.activityTimes) {
        this.getActivityTimesArray.push(this.getActivityTime(activity));
      }
    }


    if (venue.amenitiesList) {
      venue.amenitiesList.forEach((i) => {
        const found = this.amenetiesList.find((cat) => cat.id === i);

        if (found) {
          const foundIndex = this.amenetiesList.findIndex(cat => found.id === cat.id);
          (this.form.get('details').get('ameneties') as FormArray).at(foundIndex).setValue(true);
        }
      });
    }

    if (venue.categoriesList) {
      venue.categoriesList.forEach((i) => {
        const found = this.categories.find((cat) => cat.id === i);

        if (found) {
          const foundIndex = this.categories.findIndex(cat => found.id === cat.id);
          (this.form.get('details').get('categories') as FormArray).at(foundIndex).setValue(true);
        }
      });
    }

    if (venue.seatingDetails) {
      venue.seatingDetails.forEach((i, index) => {
        const found = this.seatingOptions.find((cat) => cat.id === i.seatingOption);

        if (found) {
          const foundIndex = this.seatingOptions.findIndex(cat => found.id === cat.id);
          (this.form.get('details').get('seatingDetails') as FormArray).at(foundIndex).get('checkbox').setValue(true);
          (this.form.get('details').get('seatingDetails') as FormArray).at(foundIndex).get('capacity').setValue(i.capacity);
        }
      });
    }
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  async submit(data: VenueEditForm) {
    const venueData = this.venueEditService.prepareVenueEditDTO(data);
    const error = this.validateVenueOnSave(data);
    if (error) return this.alertify.error(error);

    this.loading = true;
    this.blockUI.start('Saving...'); // Start blocking

    try {
      if (this.form.get('details').dirty || this.form.get('address').dirty) {
        if (this.editMode ) {
          console.log('venue data on submit: ', venueData);
          await this.venueService.updateVenue(this.venueId, venueData).toPromise();
        } else {
          this.venue = await this.venueService.createVenue(venueData).toPromise();
        }
      }

      if (this.form.get('activityTimes').dirty) {
        await this.updateActivityTimes(data.activityTimes);
      }

      if (this.form.get('pricing').dirty) {
        await this.updatePricing(data.pricing);
      }

      if (this.fileUploader.uploader.queue) {
        await this.uploadImages(this.fileUploader.uploader.queue);
      }

      this.form.markAsPristine();
      this.venue = await this.venueService.getVenue(this.venue.id).toPromise();
      this.updateSeatingDetails();
      this.alertify.success('Successfully updated');
      this.router.navigate(['/venues/edit/' + this.venue.id]);
    } catch (e) {
      this.alertify.error('Error while updating entity');
    } finally {
      this.blockUI.stop();
      this.loading = false;
    }
  }

  updateSeatingDetails() {
    this.seatingOptions.map((option, index) => {
      if (this.venue.seatingDetails.find((i) => i.seatingOption !== option.id)) {
        (this.form.get('details').get('seatingDetails') as FormArray).at(index).get('capacity').setValue(0);
      }
    });
  }

  validateVenueOnSave(data: VenueEditForm): string {
    console.log('validate save');
    if (!data.details.name) return 'Venue name is required';
    if (!data.details.realName) return 'Real name is required';

    return;
  }

  validateVenueOnPublish(venue: Venue): string {
    console.log(venue);
    if (!venue.activityTimes.length) return 'Activity times are not set.';
    if (!venue.pricingDetails || !venue.pricingDetails.pricePerHour_WithoutVAT) return 'Price per hour is required';
    if (!venue.categories) return 'Categories are required';
    if (!venue.amenitiesList || venue.amenitiesList.length === 0) return 'Amenities are required';
    if (!venue.phoneNumber) return 'Phone number is required';
    if (!venue.email) return 'Email is required';
    // if (!venue.minParticipants) return 'Min participants is required';
    if (!venue.maxParticipants) return 'Max participants is required';
    // if (venue.cateringOptions < 0 || venue.cateringDetails > ) return 'Catering options are required';
    // if (!venue.cateringDetails) return 'Catering details are required';
    // if (!venue.directions) return 'Directions must be specified';
    if (!venue.directionsToDisplay) return 'Directions To Display must be specified';
    const photoQueueLength = this.fileUploader.uploader.queue.length;
    if (!this.venue && photoQueueLength < 3) {
      return 'Please provide at least 3 photos';
    }

    if (this.venue && (this.venue.photos.length + photoQueueLength) < 3) {
      return 'Please provide atleast 3 images';
    }

    return;
  }

  async updatePricing(data: PricingDetails) {
    if (!data.id) delete data.id;

    await this.venueService.updatePricing(this.venue.id, data).toPromise();
  }

  async updateActivityTimes(data: ActivityTime[]) {
    await this.venueService.setActivityTimes(this.venue.id, data).toPromise();
  }

  async uploadImages(files: FileItem[]) {
    if (!files || !files.length) return;

    const imageObservers = [];
    for (const file of files) {
      imageObservers.push(this.venueService.uploadVenueImage(this.venue.id, file));
    }

    const response = await zip(...imageObservers).toPromise();
    this.venue.photos.push(...response as any);
    this.fileUploader.uploader.clearQueue();

    const foundMainImage = this.venue.photos.find((i) => {
      return i.isMain;
    });

    if (foundMainImage) {
      this.venue.mainPhotoUrl = foundMainImage.url;
    }
  }

  makeDefaultImage(id: number) {
    this.venueService.setMainPhoto(this.venue.id, id).subscribe(() => {
      this.venue.photos.forEach((i) => {
        i.isMain = false;

        if (id === i.id) {
          this.venue.mainPhotoUrl = i.url;
          i.isMain = true;
        }
      });
    });
  }

  async unpublishVenue() {
    if (this.form.dirty) {
      await this.submit(this.form.value);
    }
    this.venueService.unpublishVenue(this.venue.id).subscribe(() => {
      this.venue.status = VenueStatusEnum.Draft;
      this.alertify.success('Un-published successfully');
      // this.router.navigate(['/venues/edit/' + this.venue.id]);
      this.loadVenueForEdit(this.venue);
    }, (error: Error | any) => {
      console.log(error);
      this.alertify.error('Error while un-publishing');
    });
  }

  async publishVenue() {
    if (this.form.dirty) {
      await this.submit(this.form.value);
    }
    const error = this.validateVenueOnPublish(this.venue);
    if (error) return this.alertify.error(error);
    this.venueService.publishVenue(this.venue.id).subscribe(() => {
      this.venue.status = VenueStatusEnum.Published;
      this.alertify.success('Published successfully');
      // this.router.navigate(['/venues/edit/' + this.venue.id]);
      this.loadVenueForEdit(this.venue);
    }, (err: Error | any) => {
      console.log('publish Venue error: ', err);
      this.errorhelper.showServerErrors(err);
      //this.alertify.error('Error while publishing');
    });
  }

  async deleteVenue() {
    this.venueService.deleteVenue(this.venue.id).subscribe(() => {
      this.router.navigate(['/venues/']);
      this.alertify.success('Venue deleted successfully');
    }, () => {
      this.alertify.error('Error while deleting');
    });
  }

  onTabSelected(eventCalled: any) {
    this.agmMap.triggerResize();
  }

  removeImage(image: Photo) {
    this.blockUI.start('Loading...'); // Start blocking

    this.venueService.removeVenueImage(this.venue.id, image.id).subscribe(() => {
      const index = this.venue.photos.indexOf(image);
      this.venue.photos.splice(index, 1);
      this.blockUI.stop(); // Stop blocking
    }, () => {
      this.alertify.error('Error while removing image');
      this.blockUI.stop(); // Stop blocking
    });
  }

  secureWordpressUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  copyVenue() {
    const data = JSON.stringify(this.form.value);
    const sanitizedData = JSON.parse(data);
    if (sanitizedData.pricing) {
      delete sanitizedData.pricing.id;
      sanitizedData.pricing.pricePerHour_WithoutVAT = null;
      sanitizedData.pricing.halfDayPrice = null;
      sanitizedData.pricing.fullDayPrice = null;
      sanitizedData.pricing.extraDayPrice = null;
    }
    if (sanitizedData.details) {
      sanitizedData.details.name = '';
    }


    this.router.navigate(['/venues/edit'], { queryParams: {
      venueData: JSON.stringify(sanitizedData)
    }});
  }
}
