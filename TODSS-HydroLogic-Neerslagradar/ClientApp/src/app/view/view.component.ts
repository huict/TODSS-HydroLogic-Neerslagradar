import { Component, Input, Output, EventEmitter, Directive, ViewContainerRef, ViewChild, OnInit } from '@angular/core';
import { ITemplate } from "../templates/i-template.view";
import { ITemplateChange } from "../templates/i-template-change.view";
import { TemplateSelectComponent } from "../templates/template-select/template-select.component";
import { TemplateTranslator } from "../templates/templateTranslator";

@Directive({
  selector: '[template]',
})
export class TemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @Output() removeEvent = new EventEmitter<number>();
  @ViewChild(TemplateDirective, {static: true}) viewHost!: TemplateDirective

  private _index: number = 0;
  private _name: string = "";
  private _template: ITemplate = new TemplateSelectComponent();

  constructor(private templateTranslator: TemplateTranslator) {}

  ngOnInit(): void {
    this.loadTemplate();
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

  @Input() set name(value: string) {
    this._name = value;
  }

  get template(): ITemplate {
    return this._template;
  }

  @Input() set template(value: ITemplate) {
    this._template = value;
    this.loadTemplate();
  }

  get data(): IViewData {
    return {
      name: this.name,
      templateType: this.template.constructor.name,
    }
  }

  @Input() set data(value: IViewData) {
    this.name = value.name;
    this.template = this.templateTranslator.getTemplate(value.templateType);
  }

  public throwRemoveEvent() {
    this.removeEvent.emit(this.index)
  }

  private loadTemplate() {
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

export interface IViewData {
  name: string,
  templateType: string,
}
