import {EventEmitter} from "@angular/core"
import {ITemplate} from "./i-template.view";

/**
 * An interface for templates that can change. <br>
 * Copy the next line: <br>
 * @Output() changeTemplateEvent = new EventEmitter<ITemplate>();
 */
export interface ITemplateChange extends ITemplate {
  changeTemplateEvent: EventEmitter<ITemplate>;
}
