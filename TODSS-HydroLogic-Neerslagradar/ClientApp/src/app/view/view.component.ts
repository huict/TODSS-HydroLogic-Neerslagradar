import {
  Component,
  Input,
  Output,
  EventEmitter,
  Directive,
  ViewContainerRef,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ITemplate } from "../templates/i-template.view";
import { ITemplateChange } from "../templates/i-template-change.view";
import { TemplateSelectComponent } from "../templates/template-select/template-select.component";
import { TemplateTranslator } from "../templates/templateTranslator";
import { ICoordinateFilter, ITimeFilter } from "../templates/i-weather.template";

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
export class ViewComponent implements OnInit, OnDestroy {
  @Output() removeEvent = new EventEmitter<number>();
  @ViewChild(TemplateDirective, {static: true}) viewHost!: TemplateDirective

  private _index: number = 0;
  private _name: string = "";
  private _template: ITemplate = new TemplateSelectComponent();
  private _skipInit: boolean = false;

  constructor(private templateTranslator: TemplateTranslator) {}

  ngOnInit(): void {
    if (!this._skipInit) {
      this.loadTemplate(this._template);
    }
  }

  ngOnDestroy() {
    this.removeEvent.unsubscribe();
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
    return <ITemplate> this._template;
  }

  @Input() set template(value: ITemplate) {
    // this._template = value;
    this.loadTemplate(value);
  }

  get data(): IViewData {
    return {
      name: this.name,
      templateType: this.template.constructor.name,
      data: this.template.data,
    }
  }

  @Input() set data(value: IViewData) {
    this._skipInit = true;
    this.name = value.name;
    this.loadTemplate(this.templateTranslator.getTemplate(value.templateType), value.data)
  }

  public throwRemoveEvent() {
    this.removeEvent.emit(this.index)
  }

  private loadTemplate(template: ITemplate, data?:any) {
    const viewContainerRef = this.viewHost.viewContainerRef;
    viewContainerRef.clear();
    // @ts-ignore
    const component = viewContainerRef.createComponent<ITemplate>(template.constructor).instance;
    this._template = component;
    if (data) component.data = data;
    if (component.hasOwnProperty("changeTemplateEvent")) {
      let selectComponent:ITemplateChange = <ITemplateChange> component;
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
  name: string;
  templateType: string;
  data:any;
  filters?:IFilterData;
}

export interface IFilterData {
  coordinates: ICoordinateFilter;
  time: ITimeFilter;
}
