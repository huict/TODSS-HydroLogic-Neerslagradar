import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public views_test: number[] = [];

  constructor() { }

  public addViewTest() {
    let last;
    if (this.views_test.length == 0) {
      last = -1;
    } else {
      last = this.views_test[this.views_test.length-1]
    }
    this.views_test.push(last+1)
  }
}
