import {
  Component,
  Input
} from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import {
  SyncData
} from '../../../../DB/typings/SyncData';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: []
})
export class PanelComponent {
  color = 'black';
  lineWidth = 2;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private readonly _syncServerUrl = 'http://localhost:3001';
  private _httpClient: HttpClient;
  public _shareUrl: string = document.location.pathname.substr(1);
  public data: SyncData = { Id: this._shareUrl, Time: null, Data: null };
  constructor(private http: HttpClient) {
    this._httpClient = http;
    this.shareUrl();
  }
  public syncData(data: string) {
    this.data.Data = data;
    this.data.Id = this._shareUrl;
    this._httpClient.post<SyncData>(this._syncServerUrl + '/sync', this.data, this.httpOptions)
      .subscribe(x => {
        this._shareUrl = x.Id;
        this.data.Data = x.Data;
      });
  }
  public shareUrl() {
    this._httpClient.post<SyncData>(this._syncServerUrl + '/sync', this.data, this.httpOptions)
      .subscribe(x => {
        this._shareUrl = x.Id;
        this.data.Data = x.Data;
      });
  }
  public changeColor(color: any) {
    this.color = color;
  }
  public changeWidth(width: number) {
    this.lineWidth = width;

  }
}
