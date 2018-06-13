import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LanguagesEnum } from '../../../_models/general.interface';
import {
  AmenityItemEnum,
  Venue,
  VenueCategoryEnum,
  VenueCateringOptions,
  VenueSeatingOptionEnum
} from '../../../_models/Venue';
import { VenueEditForm } from './venue-edit.interface';

@Injectable()
export class VenueEditService {

  constructor(
    private fb: FormBuilder
  ) { }


  get venueFormGroup() {
    return {
      details: this.fb.group({
        extraServicesText: '',
        roomSizeSqaureMeters: '',
        comments: '',

        status: '',
        cateringDetails: [''],
        cateringOptions: [VenueCateringOptions.None],
        // minParticipants: [0],
        maxParticipants: [''],
        name: ['', Validators.required],
        realName: [''],
        email: [''],
        about: [''],
        phoneNumber: [''],
        contactPersonName: [''],
        locale: [LanguagesEnum.EN_UK],
        categories: this.fb.array(this.venueCategoriesList.map(i => false)),
        ameneties: this.fb.array(this.amenetiesList.map(i => false)),
        seatingDetails: this.fb.array(this.seatingOptions.map(i => {
            return this.fb.group({
              checkbox: false,
              capacity: 0
            })
          })
        )
      }),
      address: this.fb.group({
        city: [''],
        lat: [''],
        lon: [''],
        fulladdress: [''],
        street: [''],
        country: [''],
        countryFullName: [''],
        directions: [''],
        directionsToDisplay: ['']
      }),
      pricing: this.fb.group({
        id: null,
        currency: [''],
        refundPolicyOption: '',
        refundPolicyOptionText: '',
        termsAndConditions: '',
        pricePerHour_WithoutVAT: [''],
        minBookingHours: [''],
        extraDayPrice: [''],
        halfDayPrice: [''],
        fullDayPrice: ['']
      }),
      activityTimes: this.fb.array([])
    };
  }
  prepareVenueEditDTO(data: VenueEditForm): Venue {
    console.log('prepareVenueEditDTO: ', data);
    const venueData: Venue = {
      extraServicesText: data.details.extraServicesText,
      roomSizeSqaureMeters: data.details.roomSizeSqaureMeters,
      comments: data.details.comments,
      status: data.details.status,
      cateringDetails: data.details.cateringDetails,
      cateringOptions: data.details.cateringOptions,
      // minParticipants: data.details.minParticipants,
      maxParticipants: data.details.maxParticipants,
      amenitiesList: this.convertToValue(data.details.ameneties, 'amenetiesList'),
      categoriesList: this.convertToValue(data.details.categories, 'venueCategoriesList'),
      // seatingOptionsList: this.convertToValue(data.details.seatingOptionsList, 'seatingOptions'),
      seatingDetails: this.convertToValueSeatingOptions(data.details.seatingDetails, 'seatingOptions'),
      name: data.details.name,
      email: data.details.email,
      about: data.details.about,
      phoneNumber: data.details.phoneNumber,
      contactPersonName: data.details.contactPersonName,
      locale: data.details.locale,
      fullAddress: data.address.fulladdress,
      directions: data.address.directions,
      directionsToDisplay: data.address.directionsToDisplay,
      lat: data.address.lat,
      lon: data.address.lon,
      country: data.address.country,
      countryFullName: data.address.countryFullName,
      city: data.address.city,
      realName: data.details.realName
    };

    return venueData;
  }

  convertToValue(data, store: 'venueCategoriesList' | 'amenetiesList' | 'seatingOptions') {
    return data.map((x, i) => x && this[store][i].id).filter(x => {
      return x !== false;
    });
  }

  convertToValueSeatingOptions(data, store: 'seatingOptions') {
    return data
      .filter((elem) => elem.checkbox)
      .map((elem, i) => {
        return {capacity: elem.capacity, seatingOption: this[store][i].id};
      });
  }

  get amenetiesList() {
    return [
      {
        id: AmenityItemEnum.Accessibility,
        name: 'Accessibility'
      },
      {
        id: AmenityItemEnum.AirConditioning,
        name: 'Air Cond. / Heating'
      },
      {
        id: AmenityItemEnum.MeetingTable,
        name: 'Meeting Table'
      },
      {
        id: AmenityItemEnum.Chairs,
        name: 'Chairs'
      },
      {
        id: AmenityItemEnum.HotDrinks,
        name: 'Hot Drinks'
      },
      {
        id: AmenityItemEnum.ColdWater,
        name: 'Cold Water'
      },
      {
        id: AmenityItemEnum.Cookies,
        name: 'Cookies'
      },
      {
        id: AmenityItemEnum.FlipChart,
        name: 'Flip Chart'
      },
      {
        id: AmenityItemEnum.Kitchen,
        name: 'Kitchen'
      },
      {
        id: AmenityItemEnum.OutdoorSeatings,
        name: 'Outdoor Seats'
      },
      {
        id: AmenityItemEnum.FreeParking,
        name: 'Free Parking'
      },
      {
        id: AmenityItemEnum.PaidParking,
        name: 'Paid Parking'
      },
      {
        id: AmenityItemEnum.Projector,
        name: 'Projector'
      },
      {
        id: AmenityItemEnum.Screen,
        name: 'Screen'
      },
      {
        id: AmenityItemEnum.Shade,
        name: 'Shade'
      },
      {
        id: AmenityItemEnum.SmokingArea,
        name: 'Smoking Area'
      },
      {
        id: AmenityItemEnum.SoundSystem,
        name: 'Sound System'
      },
      {
        id: AmenityItemEnum.Toilet,
        name: 'Toilet'
      },
      {
        id: AmenityItemEnum.TV,
        name: 'TV'
      },
      {
        id: AmenityItemEnum.VCSystem,
        name: 'VC System'
      },
      {
        id: AmenityItemEnum.WhiteBoard,
        name: 'White Board'
      },
      {
        id: AmenityItemEnum.Wifi,
        name: 'Wifi'
      },
      {
        id: AmenityItemEnum.Windows,
        name: 'Windows'
      }
    ];
  }

  get seatingOptions() {
    return [{
      id: VenueSeatingOptionEnum.RoundTable,
      name: 'Board Meeting',
      capacity: 0
    }, {
      id: VenueSeatingOptionEnum.Theatre,
      name: 'Theater',
      capacity: 0
    }, {
      id: VenueSeatingOptionEnum.Circle,
      name: 'Circle',
      capacity: 0
    }, {
      id: VenueSeatingOptionEnum.UShaped,
      name: 'U-Shaped',
      capacity: 0
    }, {
      id: VenueSeatingOptionEnum.Classroom,
      name: 'Classroom',
      capacity: 0
    }, {
      id: VenueSeatingOptionEnum.SofaSeating,
      name: 'Sofa Seating',
      capacity: 0
    }];
  }

  get venueCategoriesList() {
    return [
      {
        id: VenueCategoryEnum.ConferencesAndEvents,
        name: 'Conferences And Events'
      },
      {
        id: VenueCategoryEnum.FormalMeetings,
        name: 'Formal Meetings'
      },
      {
        id: VenueCategoryEnum.InspirationalMeetings,
        name: 'Inspirational Meetings'
      },
      {
        id: VenueCategoryEnum.MeetAndEat,
        name: 'Meet and Eat'
      }
    ];
  }
}
