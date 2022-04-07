import {Injectable} from "@angular/core";
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
          title:"compare 2 maps",
          description:"",
          views:[
            {
              name:"Map Utrecht",
              templateType: this.templateTranslator.templates.full_map,
              data:{
                map:{
                  centerLocation:{
                    lat: 52.07412382497353,
                    lng: 5.144348144531251
                  },
                  points:[
                    {
                      lat: 52.147457256841705,
                      lng: 5.012512207031251
                    },{
                      lat: 52.0038843087674,
                      lng: 5.171127319335938
                    }
                  ],
                  zoom: 11,
                }
              },
            },
            {
              name:"Map Amersfoort",
              templateType: this.templateTranslator.templates.full_map,
              data:{
                map:{
                  centerLocation:{
                    lat: 52.184779042321736,
                    lng: 5.4563597962260255
                  },
                  points:[
                    {
                      lat: 52.21501387135701,
                      lng: 5.343063287436962
                    },{
                      lat: 52.12821256438199,
                      lng: 5.472839288413525
                    }
                  ],
                  zoom: 11,
                }
              },
            }
          ],
        },
        1: {
          title:"test",
          description:"",
          views:[
            {
              name:"Nederland",
              templateType: this.templateTranslator.templates.full_map,
              data:{},
            },
            {
              name:"Test",
              templateType: this.templateTranslator.templates.test,
              data:{},
            },
            {
              name:"Select",
              templateType: this.templateTranslator.templates.select,
              data:{},
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

  public getAllConfigs() : IConfigContainer {
    return this.getDataLocal();
  }

  public removeConfig(configId: number) {
    let data = this.getDataLocal();
    delete data[configId];
    this.saveDataLocal(data)
  }
}
