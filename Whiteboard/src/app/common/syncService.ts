import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import {
  SyncData
} from '../../../../DB/typings/SyncData';

export class SyncService {

  private readonly _syncServerUrl = 'http://localhost:3001';
  private _httpClient: HttpClient;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) {
    this._httpClient = http;
  }
  public syncData(data: SyncData) {
    this._httpClient.post<SyncData>(this._syncServerUrl + '/sync', data, this.httpOptions)
      .subscribe(x => {
        data.Id = x.Id;
        data.Data = x.Data;
      });
  }
  public getData(data: SyncData) {

    if (data.Id != null && data.Id !== '') {
      this._httpClient.post<SyncData>(this._syncServerUrl + '/get', { Id: data.Id }, this.httpOptions)
        .subscribe(x => {
          data.Id = x.Id;
          data.Data = x.Data;
        });
    }

  }

}
