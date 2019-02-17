import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PanelComponent } from './panel.component';

@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [PanelComponent]
})
export class PanelModule {

}
