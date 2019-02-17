import { Component } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: []
})
export class PanelComponent {

  color = 'black';
  lineWidth = 2;
  constructor() {

  }

  public changeColor(color: any) {
    this.color = color;
  }
  public changeWidth(width: number) {
    this.lineWidth = width;

  }
}
