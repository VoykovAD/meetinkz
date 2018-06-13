import { Routes } from '@angular/router';
import { VenuesListComponent } from './_components/venues/venues-list/venues-list.component';
import { CustomersListComponent } from './_components/customers-list/customers-list.component';
import { BookingsListComponent } from './_components/bookings-list/bookings-list.component';
import { HomeComponent } from './_components/home/home.component';
import { AuthGuard } from './_guards/auth.guard';
import { VenueDetailComponent } from './_components/venues/venue-detail/venue-detail.component';
import { VenueEditComponent } from './_components/venues/venue-edit/venue-edit.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'venues', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'venues',
        component: VenuesListComponent
      },
      { path: 'venues/edit', component: VenueEditComponent },
      { path: 'venues/edit/:id', component: VenueEditComponent },
      { path: 'customers', component: CustomersListComponent },
      { path: 'bookings', component: BookingsListComponent }
    ]
  },
  { path: '**', redirectTo: 'venues', pathMatch: 'full' }
];
