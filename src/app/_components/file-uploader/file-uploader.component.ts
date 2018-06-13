import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  exportAs: 'fileUploader'
})
export class FileUploaderComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + this.jwtHelper.tokenGetter()
  });

  constructor(
    private jwtHelper: JwtHelperService
  ) { }

  ngOnInit() {
  }

}
