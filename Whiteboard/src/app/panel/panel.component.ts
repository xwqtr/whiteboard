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
  _shareUrl = '';
  public changeColor(color: any) {
    this.color = color;
  }
  public changeWidth(width: number) {
    this.lineWidth = width;

  }
}
