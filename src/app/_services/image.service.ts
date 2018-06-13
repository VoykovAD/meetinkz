import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FileItem } from 'ng2-file-upload';

@Injectable()
export class ImageService {

  constructor() { }

  uploadFileItemImage(url: string, file: FileItem): Observable<any> {
    return Observable.create((observer) => {
      file.url = url;
      file.withCredentials = true;
      file.upload();

      file.onSuccess = (response) => {
        observer.next(JSON.parse(response));
        observer.complete();
      };

      file.onError = (response) => {
        observer.error(response);
      };
    });
  }

}
