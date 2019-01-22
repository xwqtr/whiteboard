import { Component } from '@angular/core';

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
  private currX = 0;
  private prevY = 0;
  private currY = 0;
  constructor() {

  }

  startPaint() {
    this._timeToPaint = true;
  }
  endPaint() {
    this._timeToPaint = false;
    this.prevX = 0;
    this.prevY = 0;
  }
  cursorOut() {
    this.prevX = 0;
    this.prevY = 0;
    thi.endPaint();
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

        this._canvasContext.beginPath();
        this._canvasContext.moveTo(this.prevX, this.prevY);
        this._canvasContext.lineTo(event.layerX, event.layerY);
        this._canvasContext.strokeStyle = 'black';
        this._canvasContext.lineWidth = 2;
        this._canvasContext.closePath();
        this._canvasContext.stroke();
        this.prevX = event.layerX;
        this.prevY = event.layerY;
      }


    }


  }

}
