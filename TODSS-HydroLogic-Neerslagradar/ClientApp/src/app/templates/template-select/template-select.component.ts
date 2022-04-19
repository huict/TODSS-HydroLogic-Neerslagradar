import {Component, Type, Output, EventEmitter, OnDestroy} from '@angular/core';
import { ITemplate } from "../i-template.view";
import { TemplateTestComponent } from "../template-test/template-test.component";
import { ITemplateChange } from "../i-template-change.view";
import { TemplateFullMapComponent } from "../template-full-map/template-full-map.component";

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
  @Output() changeTemplateEvent = new EventEmitter<ITemplate>()

  constructor() { }

  ngOnDestroy(): void {
    this.changeTemplateEvent.unsubscribe();
  }

  public throwChangeEvent(template: Type<ITemplate>) {
    this.changeTemplateEvent.emit(new template())
  }

  get data(): any {return {}}

  set data(value: any) {}
}
