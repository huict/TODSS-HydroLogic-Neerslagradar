import { Component, Input } from '@angular/core';

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  private _index: number | undefined;
  public colors: string[] = ["red", "orange", "yellow", "lightgreen", "green", "lightblue", "blue", "purple", "brown"];

  constructor() {
  }

  get index(): number | undefined {
    return this._index;
  }

  @Input() set index(value: number | undefined) {
    this._index = value;
  }

  get color(): string {
    if (this.index == undefined) return "transparent";
    return this.colors[this.index];
  }
}
