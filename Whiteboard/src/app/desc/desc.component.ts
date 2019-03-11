import { Component, Input } from '@angular/core';

import { PanelComponent } from '../panel/panel.component';
@Component({
  selector: 'app-desc',
  templateUrl: './desc.component.html',
  styleUrls: ['./desc.component.css']
})
export class DescComponent {
  private _canvas: HTMLCanvasElement;
  private _canvasContext: CanvasRenderingContext2D;
  private _timeToPaint = false;
  private prevX = 0;
  private prevY = 0;
  private sessionId: string = null;
  @Input() panel: PanelComponent;


  private _color = () => this.panel.color;
  private _width = () => this.panel.lineWidth;
  private updateData() {
    const d = this._canvas.toDataURL();
    this.panel.syncData(d);
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
