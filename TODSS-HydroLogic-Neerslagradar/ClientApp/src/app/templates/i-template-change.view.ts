import {EventEmitter} from "@angular/core"
import {ITemplate} from "./i-template.view";

// Is bedoeld om aan te geven dat een template zijn template type kan veranderen.
// De verplichte line die wordt bedoeld met deze interface:
// @Output() changeTemplateEvent = new EventEmitter<ITemplate>();

export interface ITemplateChange {
  changeTemplateEvent: EventEmitter<ITemplate>;
}
