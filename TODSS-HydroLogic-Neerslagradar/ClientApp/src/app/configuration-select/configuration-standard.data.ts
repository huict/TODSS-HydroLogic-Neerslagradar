import {Injectable} from "@angular/core";
import {TemplateTranslator} from "../templates/templateTranslator";
import {IConfigContainer} from "./configuration.manager";


/**
 * These are the standard configurations that are loaded in when a user enters the site for the first time
 */
@Injectable({providedIn:"root"})
export class ConfigurationStandardData {
  constructor(private templateTranslator: TemplateTranslator) {}

  get standardData(): IConfigContainer {
    return {
      0: {
        id: 0,
        title:"compare 2 maps",
        description:"Configuration to compare 2 maps",
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
        id: 1,
        title:"test",
        description:"This is a test!",
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
  }
}
