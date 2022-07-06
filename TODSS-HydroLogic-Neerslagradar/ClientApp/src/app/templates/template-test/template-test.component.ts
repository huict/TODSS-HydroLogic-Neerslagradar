import { Component } from '@angular/core';
import {ITemplate} from "../i-template.view";

// Deze template is gebruikt om nieuwe components te testen
@Component({
  selector: 'app-template-test',
  templateUrl: './template-test.component.html',
  styleUrls: ['./template-test.component.css']
})
export class TemplateTestComponent implements ITemplate {
  constructor() {}

  get data(): any {
    return {}
  }

  set data(value: any) {}

  get settings(): HTMLElement {
    return document.createElement("div");
  }
}
