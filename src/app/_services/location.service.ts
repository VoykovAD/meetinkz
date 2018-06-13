import { Injectable } from '@angular/core';


interface GoogleParsedAddress {
  country?: string;
  route?: string;
  street_number?: string;
  postal_code?: string;
  locality?: string;
  sublocality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_2?: string;
  postal_town?: string;
  country_short?: string;
  neighborhood?: string;
}

export interface ParsedAddress {
  poi?: boolean;
  name?: string;
  country: string;
  street: string;
  streetNum: string;
  neighborhood: string;
  state?: string;
  zip: string;
  city: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  countryShort: string;
}

@Injectable()
export class LocationService {

  constructor() { }

  parseGooglePlaceAddress(address: google.maps.GeocoderAddressComponent[], name?: string): ParsedAddress {
    console.log('parseGooglePlaceAddress: ', address);
    const parsedAddress: GoogleParsedAddress = {};
    address.forEach((item) => {
      item.types.forEach((value) => {
        // if it's the state we want to use the short name of it. i.e NY

        if (value === 'administrative_area_level_1') {
          parsedAddress[value] = item.short_name;
        } else if (value === 'country') {
          parsedAddress[value] = item.long_name;
          parsedAddress.country_short = item.short_name;
        } else {
          parsedAddress[value] = item.long_name;
        }
      });
    });

    console.log('parsedAddress: ', parsedAddress);
    const addressObject = {
      countryShort: parsedAddress.country_short,
      state: parsedAddress.administrative_area_level_1,
      country: parsedAddress.country,
      street: parsedAddress.route,
      streetNum: parsedAddress.street_number,
      neighborhood: parsedAddress.neighborhood,
      zip: parsedAddress.postal_code,
      city: parsedAddress.locality || parsedAddress.sublocality || parsedAddress.postal_town || parsedAddress.administrative_area_level_1,
    };

    if (addressObject.city === addressObject.street) {
      addressObject.street = '';
    }

    return addressObject;
  }

}
