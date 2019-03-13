import { Component, Input, DoCheck, KeyValueDiffers } from '@angular/core';
import { SyncData } from '../../../../DB/typings/SyncData';
import { PanelComponent } from '../panel/panel.component';
import { timer } from 'rxjs';
import { SyncService } from '../common/syncService';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-desc',
  templateUrl: './desc.component.html',
  styleUrls: ['./desc.component.css']
})
export class DescComponent implements DoCheck {
  private _canvas: HTMLCanvasElement;
  private _canvasContext: CanvasRenderingContext2D;
  private _timeToPaint = false;
  private prevX = 0;
  private prevY = 0;
  private sessionId: string = document.location.pathname.substr(1);
  private _data: SyncData = { Id: this.sessionId, Time: null, Data: null };
  private timer = timer(1000, 2000);
  private _ss: SyncService;
  @Input() panel: PanelComponent;
  differ: any;


  constructor(private differs: KeyValueDiffers, private http: HttpClient) {
    this._ss = new SyncService(http);
    this.differ = this.differs.find({}).create();
    this.timer.subscribe(x => this._ss.getData(this._data));
    if (this._data.Id && this._data.Id !== '') {
      this._ss.getData(this._data);
    } else {
      this._ss.syncData(this._data);
    }
  }
  ngDoCheck(): void {
    const d = this._data;
    const p = () => this.panel;
    const change = this.differ.diff(d);
    if (change) {
      change.forEachChangedItem(item => {
        this.updateCanvasFromDataUrl(d.Data);
        p()._shareUrl = d.Id;
      });
    }
  }
  updateCanvasFromDataUrl(du: string) {
    if (du && this._canvas) {
      const cnc = this._canvas.getContext('2d');
      const i = new Image;
      i.onload = () => {
        cnc.drawImage(i, 0, 0, cnc.canvas.width, cnc.canvas.height);
      };
      i.src = du;

    }

  }

  private _color = () => this.panel.color;
  private _width = () => this.panel.lineWidth;
  private updateData() {
    const d = this._canvas.toDataURL();
    this._data.Data = d;
    this._ss.syncData(this._data);
  }

  startPaint() {
    this._timeToPaint = true;
  }
  endPaint() {
    this._timeToPaint = false;
    this.prevX = 0;
    this.prevY = 0;
    this.updateData();
  }
  cursorOut() {
    this.prevX = 0;
    this.prevY = 0;
    this.endPaint();
  }
  paintStuff(event: MouseEvent, canvas: HTMLCanvasElement) {
    this._canvas = this._canvas == null ? canvas : this._canvas;
    if (this._canvasContext == null) {
      this._canvasContext = this._canvas.getContext('2d');
      this._canvasContext.canvas.width = window.innerWidth;
      this._canvasContext.canvas.height = window.innerHeight;
    }
    if (this._timeToPaint) {
      console.log('X:' + event.layerX + ' Y:' + event.layerY);
      if (this.prevX === 0 && this.prevY === 0) {
        this.prevX = event.layerX;
        this.prevY = event.layerY;
      } else {

        const color = this._color();
        const width = this._width();
        // draw line.
        this._canvasContext.beginPath();
        this._canvasContext.moveTo(this.prevX, this.prevY);
        this._canvasContext.lineTo(event.layerX, event.layerY);
        this._canvasContext.strokeStyle = color;
        this._canvasContext.lineWidth = width;
        this._canvasContext.stroke();
        this._canvasContext.closePath();
        // draw circle.
        this._canvasContext.beginPath();
        this._canvasContext.fillStyle = color;
        this._canvasContext.arc(event.layerX, event.layerY, width / 2, 0, 2 * Math.PI);
        this._canvasContext.fill();
        this._canvasContext.closePath();

        this.prevX = event.layerX;
        this.prevY = event.layerY;
      }


    }


  }

}
