import {Injectable} from "@angular/core";
import {IConfiguration} from "../home/home.component";

interface IConfigContainer {
  [key: number]: IConfiguration;
}

/**
 * Voor het persisteren van configuraties.
 */
@Injectable({providedIn:"root"})
export class ConfigurationManager {
  private dataName: string = "configurations";

  constructor() {}

  private getDataLocal(): IConfigContainer {
    let data = localStorage.getItem(this.dataName);
    if (data) {
      return JSON.parse(data);
    } else {
      // TODO return standard configs at first launch
      return {
        0: {
          name:"empty",
        },
        1: {
          name:"compare 2 maps",
        }
      }
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

  public getConfig(configId: number): object {
    return this.getDataLocal()[configId];
  }

  public removeConfig(configId: number) {
    let data = this.getDataLocal();
    delete data[configId];
    this.saveDataLocal(data)
  }
}
