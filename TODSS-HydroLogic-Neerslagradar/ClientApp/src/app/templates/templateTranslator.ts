import {Injectable} from "@angular/core";
import {ITemplate} from "./i-template.view";
import {TemplateFullMapComponent} from "./template-full-map/template-full-map.component";
import {TemplateSelectComponent} from "./template-select/template-select.component";
import {TemplateTestComponent} from "./template-test/template-test.component";

@Injectable({providedIn:"root"})
export class TemplateTranslator {
  public templates = {
    full_map: TemplateFullMapComponent.name,
    test: TemplateTestComponent.name,
    select: TemplateSelectComponent.name,
  }

  public getTemplate(templateName: string): ITemplate {
    switch (templateName) {
      case this.templates.full_map: return new TemplateFullMapComponent;
      case this.templates.test: return new TemplateTestComponent;
      case this.templates.select:
      default: return new TemplateSelectComponent;
    }
  }
}
