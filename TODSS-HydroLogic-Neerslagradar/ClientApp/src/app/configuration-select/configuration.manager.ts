﻿import {Injectable} from "@angular/core";
import {IConfiguration} from "../home/home.component";
import {TemplateTranslator} from "../templates/templateTranslator";

interface IConfigContainer {
  [key: number]: IConfiguration;
}

/**
 * Voor het persisteren van configuraties.
 */
@Injectable({providedIn:"root"})
export class ConfigurationManager {
  private dataName: string = "configurations";

  constructor(private templateTranslator: TemplateTranslator) {}

  private getDataLocal(): IConfigContainer {
    let data = localStorage.getItem(this.dataName);
    if (data) {
      return JSON.parse(data);
    } else {
      // TODO return standard configs at first launch
      let standard = {
        0: {
          name:"compare 2 maps",
          views:[
            {
              name:"Map Utrecht",
              templateType: this.templateTranslator.templates.full_map
            },
            {
              name:"Map Amersfoort",
              templateType: this.templateTranslator.templates.full_map
            }
          ],
        },
        1: {
          name:"test",
          views:[
            {
              name:"Nederland",
              templateType: this.templateTranslator.templates.full_map
            },
            {
              name:"Test",
              templateType: this.templateTranslator.templates.test
            },
            {
              name:"Select",
              templateType: this.templateTranslator.templates.select
            }
          ]
        }
      }
      // this.saveDataLocal(standard);
      return standard;
    }
  }

  private saveDataLocal(data: IConfigContainer) {
    localStorage.setItem(this.dataName, JSON.stringify(data));
  }

  public getNewIndex(): number {
    let keys = Object.keys(this.getDataLocal())
    if (keys.length == 0) return 0;
    return Number(keys.sort()[keys.length-1]) + 1;
  }

  public saveConfig(configId: number, config: IConfiguration) {
    let data = this.getDataLocal();
    data[configId] = config;
    this.saveDataLocal(data)
  }

  public getConfig(configId: number): IConfiguration {
    return this.getDataLocal()[configId];
  }

  public removeConfig(configId: number) {
    let data = this.getDataLocal();
    delete data[configId];
    this.saveDataLocal(data)
  }
}