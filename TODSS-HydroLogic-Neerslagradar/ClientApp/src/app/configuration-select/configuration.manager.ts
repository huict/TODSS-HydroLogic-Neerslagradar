import {Injectable} from "@angular/core";
import {IConfiguration} from "../home/home.component";
import {ConfigurationStandardData} from "./configuration-standard.data";

export interface IConfigContainer {
  version: number,
  configurations: IConfiguration[],
}

/**
 * A manager for the persistence of the configurations. The configurations are saved in the local storage but may be
 * saved to a server later if accounts are added.
 */
@Injectable({providedIn:"root"})
export class ConfigurationManager {
  // The key that is used in the database
  private dataName: string = "configurations";

  constructor(private standardData: ConfigurationStandardData) {}

  private getDataLocal(): IConfigContainer {
    let data = localStorage.getItem(this.dataName);
    // If there is config data in local storage than load that configuration (allso checks configuration version). Else load and save the standard configurations.
    if (data) {
      let jsonData = JSON.parse(data);
      if (jsonData.hasOwnProperty("version") && jsonData.version === ConfigurationStandardData.configVersion) return jsonData;
      return this.standardData.standardData;
    } else {
      const standard = this.standardData.standardData;
      this.saveDataLocal(standard);
      return standard;
    }
  }

  private saveDataLocal(data: IConfigContainer) {
    localStorage.setItem(this.dataName, JSON.stringify(data));
  }

  /**
   * Generates a new and unique id number
   */
  public getNewIndex(): number {
    let keys = this.getDataLocal().configurations.map(c => c.id);
    if (keys.length == 0) return 0;
    return keys.sort()[keys.length-1] + 1;
  }

  /**
   * Persist a configuration.
   * @param configId the id, see the method getNewIndex if creating a new configuration. Else give an existing id to
   * update a configuration.
   * @param config configuration
   */
  public saveConfig(configId: number, config: IConfiguration) {
    let data = this.getDataLocal();
    let existingConfigIndex = data.configurations.findIndex(c => c.id === configId);
    if (existingConfigIndex === -1) {
      data.configurations.push(config);
    } else {
      data.configurations[existingConfigIndex] = config;
    }
    this.saveDataLocal(data)
  }

  /**
   * Gets a configuration by it's id.
   * @param configId id
   */
  public getConfig(configId: number): IConfiguration {
    // @ts-ignore
    return this.getDataLocal().configurations.find(c => c.id == configId);
  }

  /**
   * Get all the configurations. This is an object with the id as key.
   */
  public getAllConfigs() : IConfigContainer {
    return this.getDataLocal();
  }

  /**
   * Remove a configuration.
   * @param configId id
   */
  public removeConfig(configId: number) {
    let data = this.getDataLocal();
    data.configurations = data.configurations.filter(c => c.id !== configId);
    this.saveDataLocal(data)
  }
}
