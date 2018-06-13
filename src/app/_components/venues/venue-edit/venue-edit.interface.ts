import { VenueStatusEnum } from '../../../../../../web/src/app/models/Venue';
import { LanguagesEnum } from '../../../_models/general.interface';
import {
  ActivityTime,
  AmenityItemEnum,
  PricingDetails, seatingDetails,
  VenueCategoryEnum,
  VenueCateringOptions, VenueSeatingOptionEnum
} from '../../../_models/Venue';

export interface VenueEditForm {
  details: {
    extraServicesText: string;
    roomSizeSqaureMeters: number;
    comments: string;
    // seatingOptionsList: VenueSeatingOptionEnum[];
    seatingDetails: seatingDetails[];
    status: VenueStatusEnum;
    cateringDetails: string;
    cateringOptions: VenueCateringOptions;
    maxParticipants: number;
    // minParticipants: number;
    categories: VenueCategoryEnum[];
    ameneties: AmenityItemEnum[];
    name: string;
    realName: string;
    email: string;
    about: string;
    phoneNumber: string;
    contactPersonName: string;
    locale: LanguagesEnum;
  };
  address: {
    city: string;
    lat: number;
    lon: number;
    fulladdress: string;
    country: string;
    countryFullName: string;
    directions: string;
    directionsToDisplay: string;
  };
  pricing: PricingDetails;
  activityTimes: ActivityTime[];
}
