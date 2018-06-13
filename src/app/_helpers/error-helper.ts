import { Injectable } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class Errorhelper {
    /**
     *
     */
    constructor(private alertify: AlertifyService) {
    }
    showServerErrors(err: any) {
        if (err) {
            for (const key in err) {
                if (err[key]) {
                  this.alertify.error(err[key]);
                }
              }
        }
    }
}
