import { Component, Input, Output, EventEmitter, Directive, ViewContainerRef, ViewChild, OnInit } from '@angular/core';
import { ITemplate } from "../templates/i-template.view";
import { ITemplateChange } from "../templates/i-template-change.view";
import { TemplateSelectComponent } from "../templates/template-select/template-select.component";

@Directive({
  selector: '[viewTemplate]',
})
export class ViewDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @Output() removeEvent = new EventEmitter<number>();
  @ViewChild(ViewDirective, {static: true}) viewHost!: ViewDirective

  private _index: number = 0;
  private _name: string = "";
  private _template: ITemplate = new TemplateSelectComponent();

  constructor() {
  }

  ngOnInit(): void {
    this.loadView();
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

  get template(): ITemplate {
    return this._template;
  }

  @Input() set template(value: ITemplate) {
    this._template = value;
    this.loadView();
  }

  public throwRemoveEvent() {
    this.removeEvent.emit(this.index)
  }

  public loadView() {
    const viewContainerRef = this.viewHost.viewContainerRef;
    viewContainerRef.clear();

    // @ts-ignore
    const componentRef = viewContainerRef.createComponent<ITemplate>(this.template.constructor);
    if (componentRef.instance.hasOwnProperty("changeTemplateEvent")) {
      let selectComponent:ITemplateChange = <ITemplateChange> componentRef.instance;
      selectComponent.changeTemplateEvent.subscribe(t => {
        this.template = t;
      })
    }

    // TODO package data
    // dit is hoe we de data van instantie naar instantie kunnen verplaatsen. (het moet alleen nog gepackaged worden)
    // componentRef.instance.data = this.template.data;
  }

  public openSettings() {
    // TODO display settings
    console.log("to be implemented")
  }

  // TODO temporary for testing
  public colors: string[] = ["red", "orange", "yellow", "lightgreen", "green", "lightblue", "blue", "purple", "brown"];
  get color(): string {
    if (this.index == undefined) return "white";
    return this.colors[this.index];
  }
}