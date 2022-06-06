import {Component, Type, Output, EventEmitter, OnDestroy} from '@angular/core';
import { ITemplate } from "../i-template.view";
import { TemplateTestComponent } from "../template-test/template-test.component";
import { ITemplateChange } from "../i-template-change.view";
import { TemplateFullMapComponent } from "../template-full-map/template-full-map.component";
import {TemplateBarChartComponent} from "../template-bar-chart/template-bar-chart.component";

/**
 * This template is used to select a different template on the view and so it is the standard template that is loaded
 * inside of a view.
 */
@Component({
  selector: 'app-template-select',
  templateUrl: './template-select.component.html',
  styleUrls: ['./template-select.component.css']
})
export class TemplateSelectComponent implements ITemplateChange, OnDestroy {
  templateTest = TemplateTestComponent;
  templateFullMap = TemplateFullMapComponent;
  templateBarChart = TemplateBarChartComponent;

  @Output() changeTemplateEvent = new EventEmitter<ITemplate>();
  @Output() changeNameEvent = new EventEmitter<Event>();

  private _selectedTemplate: Type<ITemplate> | undefined;
  private _lastSelectedButton: HTMLElement | undefined;

  constructor() { }

  ngOnDestroy(): void {
    this.changeTemplateEvent.unsubscribe();
  }

  public selectTemplate(e: Event, template: Type<ITemplate>) {
    this._selectedTemplate = template;

    // @ts-ignore
    let selectedButton: HTMLElement = e.target;
    selectedButton.classList.add("selected")
    if (this._lastSelectedButton) this._lastSelectedButton.classList.remove("selected")
    this._lastSelectedButton = selectedButton;
  }

  public applyTemplate() {
    if (this._selectedTemplate) {
      this.changeTemplateEvent.emit(new this._selectedTemplate());
    } else {
      alert("Selecteer een template");
    }
  }

  get data(): any {return {}}

  set data(value: any) {}

  get settings(): HTMLElement {
    return document.createElement("div");
  }
}
