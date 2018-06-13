import { Photo } from './Photo';
import { CurrencyEnum, LanguagesEnum } from './general.interface';

export enum VenueStatusEnum {
  Draft = 1,
  Published = 2
}

export interface seatingDetails {
  seatingOption: number;
  capacity: number;
}
export interface ActivityTime {
  day: number;
  openTime: number;
  closeTime: number;
}

export interface PricingDetails {
  id?: number;
  refundPolicyOption: VenueRefundPolicyOptionEnum;
  refundPolicyOptionText: string;
  currency: CurrencyEnum;
  extraDayPrice: number;
  fullDayPrice: number;
  halfDayPrice: number;
  minBookingHours: number;
  pricePerHour_WithoutVAT: number;
  termsAndConditions: string;
  rowVersion?: number;
}

export enum AmenityItemEnum {
  None = 0,
  Accessibility = 1,
  AirConditioning = 2,
  MeetingTable = 4,
  Chairs = 8,
  HotDrinks = 16,
  ColdWater = 32,
  Cookies = 64,
  Kitchen = 128,
  OutdoorSeatings = 256,
  FreeParking = 512,
  Projector = 1024,
  Screen = 2048,
  Shade = 4096,
  SmokingArea = 8192,
  SoundSystem = 16384,
  Toilet = 32768,
  TV = 65536,
  VCSystem = 131072,
  WhiteBoard = 262144,
  Wifi = 524288,
  Windows = 1048576,
  PaidParking = 2097152,
  FlipChart = 4194304
}

export enum VenueCategoryEnum {
  All = 0,
  InspirationalMeetings = 1,
  FormalMeetings = 2,
  ConferencesAndEvents = 4,
  MeetAndEat = 8
}

export enum VenueSeatingOptionEnum {
  Other = 0,
  RoundTable = 1,
  Theatre = 2,
  Circle = 4,
  UShaped = 8,
  Classroom = 16,
  SofaSeating = 32
}

export enum VenueCateringOptions {
  Internal = 0,
  External = 1,
  Both = 2,
  None = 3
}

export enum VenueRefundPolicyOptionEnum {
  UpTo_3Days_FullRefund = 0,
  UpTo_7Days_FullRefund = 1,
  UpTo_7Days_HalfRefund = 2,
  Other = 3
}

export interface Venue {
  // description
  id?: number;
  locale: LanguagesEnum;
  name: string;
  about: string;
  cateringOptions: VenueCateringOptions;
  cateringDetails: string;
  realName: string;
  phoneNumber: string;
  email: string;
  contactPersonName: string;
  directions: string;
  directionsToDisplay: string;
  created?: string;
  createdBy?: any;
  status?: VenueStatusEnum;

  pricingDetails?: PricingDetails;

  // venue details
  categoriesList?: VenueCategoryEnum[];
  categories?: VenueCategoryEnum[];
  // seatingOptionsList: VenueSeatingOptionEnum[];
  seatingDetails: seatingDetails[];

  amenitiesList?: AmenityItemEnum[];
  ratingAvg?: number;
  amenities?: number;
  seatingOptions?: number;
  // minParticipants?: number;
  maxParticipants?: number;
  roomSizeSqaureMeters?: number;
  openingTimesText?: string;
  extraServicesText?: string;
  isSmokingAllowed?: boolean;
  isExternalFoodAllowed?: boolean;
  isAccessible?: boolean;
  comments?: string;

  // location
  lat: number;
  lon: number;
  distance?: number;
  fullAddress: string;
  country: string;
  countryFullName: string;
  city: string;

  // photos
  photos?: Photo[];
  photoUrl?: string;
  mainPhotoUrl?: string;

  // wordpress
  wordPressPageUrl?: string;
  importedWordPressHtml_EN?: string;
  importedWordPressHtml_HE?: string;

  activityTimes?: ActivityTime[];
}
