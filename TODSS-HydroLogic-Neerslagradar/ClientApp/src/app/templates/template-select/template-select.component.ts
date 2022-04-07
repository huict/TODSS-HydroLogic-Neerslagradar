import { Component, Type, Output, EventEmitter } from '@angular/core';
import { ITemplate } from "../i-template.view";
import { TemplateTestComponent } from "../template-test/template-test.component";
import { ITemplateChange } from "../i-template-change.view";
import { TemplateFullMapComponent } from "../template-full-map/template-full-map.component";

@Component({
  selector: 'app-template-select',
  templateUrl: './template-select.component.html',
  styleUrls: ['./template-select.component.css']
})
export class TemplateSelectComponent implements ITemplateChange {
  templateTest = TemplateTestComponent;
  templateFullMap = TemplateFullMapComponent;
  @Output() changeTemplateEvent = new EventEmitter<ITemplate>()

  constructor() { }

  public throwChangeEvent(template: Type<ITemplate>) {
    this.changeTemplateEvent.emit(new template())
  }

  get data(): any {return {}}

  set data(value: any) {}
}
