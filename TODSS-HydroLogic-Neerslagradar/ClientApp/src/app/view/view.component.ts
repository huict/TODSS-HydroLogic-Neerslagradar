import {
  Component,
  Input,
  Output,
  EventEmitter,
  Directive,
  ViewContainerRef,
  ViewChild,
  OnInit,
  OnDestroy, ElementRef
} from '@angular/core';
import { ITemplate } from "../templates/i-template.view";
import { ITemplateChange } from "../templates/i-template-change.view";
import { TemplateSelectComponent } from "../templates/template-select/template-select.component";
import { TemplateTranslator } from "../templates/templateTranslator";
import { ICoordinateFilter, ITimeFilter } from "../templates/i-weather.template";

/**
 * A reference to the container where a template is to be loaded in. Only one template should be loaded at once.
 */
@Directive({
  selector: '[template]',
})
export class TemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

/**
 * The view component is a middle way between the view container in home and the templates. This component manages
 * settings that should otherwise be applicable for all templates. So to reduce duplicate code the view was created.
 */
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {
  @Output() removeEvent = new EventEmitter<number>();
  @ViewChild(TemplateDirective, {static: true}) templateDirective!: TemplateDirective
  @ViewChild("templateSettings", {static: true}) templateDiv!: ElementRef;

  private _index: number = 0;
  private _name: string = "";
  private _template: ITemplate = new TemplateSelectComponent();
  private _skipInit: boolean = false;
  public settingsOpened = false;
  private _templateSettings: HTMLElement | undefined;

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
    this.loadTemplate(value);
  }

  get data(): IViewData {
    return {
      name: this.name,
      templateType: this.template.constructor.name,
      data: this.template.data,
    }
  }

  /**
   * Set the configuration data.
   * @param value view data.
   */
  @Input() set data(value: IViewData) {
    this._skipInit = true;
    this.name = value.name;
    this.loadTemplate(this.templateTranslator.getTemplate(value.templateType), value.data)
  }

  /**
   * Throws a remove event for itself.
   */
  public throwRemoveEvent() {
    this.removeEvent.emit(this.index)
  }

  // Load a new template with optionally data for the template.
  private loadTemplate(template: ITemplate, data?:any) {
    const viewContainerRef = this.templateDirective.viewContainerRef;
    // Clear the container to make sure only 1 template exists inside of it
    viewContainerRef.clear();
    // @ts-ignore
    const component = viewContainerRef.createComponent<ITemplate>(template.constructor).instance;
    this._template = component;

    // Insert data
    if (data) component.data = data;

    // Add event listeners
    // @ts-ignore
    if (component.hasOwnProperty("changeTemplateEvent")) component.changeTemplateEvent.subscribe(t => this.template = t);
    // @ts-ignore
    if (component.hasOwnProperty("changeNameEvent")) component.changeNameEvent.subscribe(e => this.changeNameOption(e));

    // Insert template dependant settings
    this.templateSettings = component.settings;
    this.templateDiv.nativeElement.innerHTML = "";
    const children = this.templateSettings.children;
    Array.from(children).forEach((child) => {
      // @ts-ignore
      child.style.margin = "10px";
    })
    this.templateDiv.nativeElement.appendChild(this.templateSettings)
  }

  get templateSettings(): HTMLElement {
    if (this._templateSettings) return this._templateSettings;
    return document.createElement("div");
  }

  set templateSettings(value: HTMLElement | undefined) {
    this._templateSettings = value;
  }

  /**
   * Open/close the settings menu.
   */
  public toggleSettings() {
    this.settingsOpened = !this.settingsOpened;
  }

  /**
   * Change the name of the view with an event.
   * @param e event of the change.
   */
  changeNameOption(e:Event) {
    // @ts-ignore
    this.name = e.target.value;
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
