import { Component } from '@angular/core';
import { ViewComponent } from "../view/view.component";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private _views: ViewComponent[] = [];

  constructor() {
    this.addView();
  }

  get views(): ViewComponent[] {
    return this._views;
  }

  public addView() {
    this._views.push(new ViewComponent());
    this.reIndex();
  }

  public removeView(index: number) {
    this._views = this._views.filter((value, i) => index != i);
    this.reIndex();
  }

  private reIndex() {
    this._views.forEach((value, i) => value.index = i);
  }

  public openSettings() {
    // TODO display settings
    console.log("to be implemented")
  }
}
