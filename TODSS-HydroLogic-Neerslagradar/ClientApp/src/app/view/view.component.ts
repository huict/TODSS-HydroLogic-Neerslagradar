import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  @Output() removeEvent = new EventEmitter<number>();

  private _index: number = 0;
  private _name: string = "";

  constructor() {
  }

  get index(): number {
    return this._index;
  }

  @Input() set index(value: number) {
    this._index = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  public throwRemoveEvent() {
    this.removeEvent.emit(this.index)
  }

  public openSettings() {
    // TODO display settings
    console.log("to be implemented")
  }

  // TODO temporary
  public colors: string[] = ["red", "orange", "yellow", "lightgreen", "green", "lightblue", "blue", "purple", "brown"];
  get color(): string {
    if (this.index == undefined) return "white";
    return this.colors[this.index];
  }
}
