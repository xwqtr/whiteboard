import { Component, Input, OnInit} from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-desc',
  templateUrl: './desc.component.html',
  styleUrls: ['./desc.component.css']
})


export class DescComponent implements OnInit {
  
  private syncServerUrl = 'http://localhost:3001';
  private _canvas: HTMLCanvasElement;
  private _canvasContext: CanvasRenderingContext2D;
  private _timeToPaint = false;
  private prevX = 0;
  private prevY = 0;
  private socket: SocketIOClient.Socket;
  private sessionId: string = document.location.pathname.substr(1);
  @Input() panel: PanelComponent;
  ngOnInit(): void {
    debugger;
    if(this.sessionId!=null&& this.sessionId!=''){
      debugger;
      this.panel._shareUrl = document.location.protocol+"//"+ document.location.host+"/" + this.socket.id;
      this.socket.id = this.sessionId;
    }
    
  }
  constructor() {
      this.socket = io.connect(this.syncServerUrl);
      this.socket.on('syncData', (data) =>{ 
      this.updateCanvasFromDataUrl(data);
      });
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
    this.socket.emit('syncData', d); 
    this.panel._shareUrl = document.location.protocol+"//"+ document.location.host+"/" + this.socket.id ;
    
    
  }

  startPaint() {
    this._timeToPaint = true;
  }
  endPaint() {
    this.prevX = 0;
    this.prevY = 0;
    this._timeToPaint = false;
    this.updateData();
  }
  cursorOut() {
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
