import { Errorhelper } from './_helpers/error-helper';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from 'ngx-gallery';
import { BlockUIModule } from 'ng-block-ui';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { VenuesListComponent } from './_components/venues/venues-list/venues-list.component';
import { NavComponent } from './_components/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { appRoutes } from './routes';
import { AlertifyService } from './_services/alertify.service';
import { AuthService } from './_services/auth.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CustomersListComponent } from './_components/customers-list/customers-list.component';
import { BookingsListComponent } from './_components/bookings-list/bookings-list.component';
import { HomeComponent } from './_components/home/home.component';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { AuthGuard } from './_guards/auth.guard';
import { VenueService } from './_services/venue.service';
import { JwtHttpInterceptor } from './_services/JwtHttpInterceptor';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { VenueCardComponent } from './_components/venues/venue-card/venue-card.component';
import { VenueDetailComponent } from './_components/venues/venue-detail/venue-detail.component';
import { VenueDetailResolver } from './_resolvers/venue-detail.resolver';
import { VenueListResolver } from './_resolvers/venue-list.resolver';
import { VenueEditComponent } from './_components/venues/venue-edit/venue-edit.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploaderComponent } from './_components/file-uploader/file-uploader.component';
import { LocationService } from './_services/location.service';
import { ImageService } from './_services/image.service';

export function getAccessToken(): string {
  return localStorage.getItem('token');
}

export const jwtConfig = {
  tokenGetter: getAccessToken,
  whitelist: [
    'localhost',
    'localhost:5000',
    'http://localhost:5000',
    'localhost:4200',
    'http://devapi.meetinkz.com/',
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    VenuesListComponent,
    CustomersListComponent,
    BookingsListComponent,
    DashboardComponent,
    VenueCardComponent,
    VenueDetailComponent,
    VenueEditComponent,
    FileUploaderComponent
  ],
  imports: [
    NgxPaginationModule,
    BlockUIModule.forRoot(),
    FileUploadModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY,
      libraries: ['places']
    }),
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'}),
    JwtModule.forRoot({
      config: jwtConfig
    }),
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    TabsModule.forRoot(),
    NgxGalleryModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true },
    AuthService,
    AlertifyService,
    AuthGuard,
    VenueService,
    ErrorInterceptorProvider,
    VenueDetailResolver,
    VenueListResolver,
    LocationService,
    ImageService,
    Errorhelper
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
