import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ActivityTime, PricingDetails, Venue } from '../_models/Venue';
import { PaginatedResult } from '../_models/Pagination';
import { ImageService } from './image.service';
import { FileItem } from 'ng2-file-upload';

@Injectable()
export class VenueService {
  baseUrl = environment.apiUrl;

  constructor(
    private authHttp: HttpClient,
    private imageService: ImageService
  ) {}

  getVenues(page?, itemsPerPage?, venueParams?: any) {
    const paginatedResult: PaginatedResult<Venue[]> = new PaginatedResult<Venue[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    console.log('venueParams', venueParams);

    if (venueParams != null) {
      if (venueParams.minAge) params = params.append('minAge', venueParams.minAge);
      if (venueParams.maxAge) params = params.append('maxAge', venueParams.maxAge);
      if (venueParams.gender) params = params.append('gender', venueParams.gender);
      if (venueParams.orderBy) params = params.append('orderBy', venueParams.orderBy);
      if (venueParams.name) params = params.append('venuename', venueParams.name);
      if (venueParams.id) params = params.append('id', venueParams.id);
      if (venueParams.status) params = params.append('status', venueParams.status);
      if (venueParams.locale) params = params.append('locale', venueParams.locale);
    }

    console.log(venueParams);

    return this.authHttp
      .get<Venue[]>(this.baseUrl + 'venues', { observe: 'response', params })
      .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          );
        }

        return paginatedResult;
      });
  }

  getVenue(id): Observable<Venue> {
    return this.authHttp.get<Venue>(this.baseUrl + 'venues/' + id);
  }

  uploadVenueImage(id: number, file: FileItem): Observable<any> {
    return this.imageService.uploadFileItemImage(this.baseUrl + 'venues/' + id + '/photos', file);
  }

  removeVenueImage(venueId: number, photoId: number): Observable<any> {
    return this.authHttp.delete<Venue>(this.baseUrl + 'venues/' + venueId + '/photos/' + photoId);
  }

  publishVenue(venueId: number): Observable<any> {
    return this.authHttp.post<Venue>(this.baseUrl + 'venues/' + venueId + '/publish', {});
  }

  unpublishVenue(venueId: number): Observable<any> {
    return this.authHttp.post<Venue>(this.baseUrl + 'venues/' + venueId + '/unpublish', {});
  }

  setMainPhoto(venueId: number, imageId: number) {
    return this.authHttp.post(
      this.baseUrl + 'venues/' + venueId + '/photos/' + imageId + '/setMain',
      {}
    );
  }

  setActivityTimes(venueId: number, data: ActivityTime[]): Observable<any> {
    return this.authHttp.post(this.baseUrl + 'venues/' + venueId + '/activitytimes', data);
  }

  updateVenue(venueId: number, data: Venue): Observable<Venue> {
    console.log('updateVenue', data);
    return this.authHttp.put<Venue>(this.baseUrl + 'venues/' + venueId, data);
  }

  createVenue(data: Venue): Observable<Venue> {
    return this.authHttp.post<Venue>(this.baseUrl + 'venues', data);
  }

  updatePricing(venueId: number, data: PricingDetails) {
    return this.authHttp.post<Venue>(this.baseUrl + 'pricing/' + venueId, data);
  }

  deleteVenue(venueId: number) {
    return this.authHttp.delete<Venue>(this.baseUrl + 'venues/' + venueId);
  }

/*
  updateUser(id: number, user: User) {
    return this.authHttp.put(this.baseUrl + 'users/' + id, user);
  }updateVenue

  setMainPhoto(userId: number, id: number) {
    return this.authHttp.post(
      this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain',
      {}
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.authHttp.delete(
      this.baseUrl + 'users/' + userId + '/photos/' + id
    );
  }
  */
}
