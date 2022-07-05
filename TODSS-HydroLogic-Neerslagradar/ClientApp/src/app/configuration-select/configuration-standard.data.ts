import {Injectable} from "@angular/core";
import {IConfigContainer} from "./configuration.manager";

/**
 * These are the standard configurations that are loaded in when a user enters the site for the first time
 */
@Injectable({providedIn: "root"})
export class ConfigurationStandardData {
  // used to check the version of configurations. Must be updated if a change is made to the persistence of configurations.
  static configVersion: number = 0.3;

  constructor() {
  }

  get standardData(): IConfigContainer {
    return {
      version: ConfigurationStandardData.configVersion,
      configurations: [
        {
          id: 0,
          title: "compare 2 maps",
          description: "Configuration to compare 2 maps",
          views: [{
            name: "Amsterdam",
            templateType: "TemplateFullMapComponent",
            data: {
              map: {
                zoom: 9,
                centerLocation: {lat: 52.40403015294171, lng: 5.026245117187501},
                mapType: "OpenStreetColor"
              },
              coordinatesFilter: {
                dataCompression: 3,
                pixels: [{
                  id: "1942",
                  value: [[
                    {lat: 52.42549, lng: 4.75075},
                    {lat: 52.41676, lng: 4.9196},
                    {lat: 52.31357, lng: 4.90511},
                    {lat: 52.32228, lng: 4.73675}
                  ]]
                }, {
                  id: "1943",
                  value: [[
                    {lat: 52.41676, lng: 4.9196},
                    {lat: 52.40773, lng: 5.08836},
                    {lat: 52.30457, lng: 5.07338},
                    {lat: 52.31357, lng: 4.90511}
                  ]]
                }]
              },
              timeFilter: {stepSize: 1, beginTimestamp: 1623981600000, endTimestamp: 1623996000000}
            }
          }, {
            name: "Utrecht",
            templateType: "TemplateFullMapComponent",
            data: {
              map: {
                zoom: 9,
                centerLocation: {lat: 52.1434188244645, lng: 5.155334472656251},
                mapType: "OpenStreetColor"
              },
              coordinatesFilter: {
                dataCompression: 3,
                pixels: [{
                  id: "2060",
                  value: [[
                    {lat: 52.20147, lng: 5.05849},
                    {lat: 52.1922, lng: 5.22619},
                    {lat: 52.08919, lng: 5.2109},
                    {lat: 52.09844, lng: 5.04369}
                  ]]
                }, {
                  id: "2118",
                  value: [[
                    {lat: 52.09844, lng: 5.04369},
                    {lat: 52.08919, lng: 5.2109},
                    {lat: 51.98625, lng: 5.1957},
                    {lat: 51.99546, lng: 5.02897}
                  ]]
                }]
              },
              timeFilter: {stepSize: 1, beginTimestamp: 1623981600000, endTimestamp: 1623996000000}
            }
          }]
        }, {
          id: 1,
          title: "Graph compare",
          description: "Compare two maps with graphs",
          views: [{
            name: "Utrecht",
            templateType: "TemplateBarChartComponent",
            data: {
              map: {
                zoom: 8,
                centerLocation: {lat: 52.12681515631792, lng: 5.251464843750001},
                mapType: "OpenStreetBW"
              },
              coordinatesFilter: {
                dataCompression: 3,
                pixels: [{
                  id: "2060",
                  value: [[
                    {lat: 52.20147, lng: 5.05849},
                    {lat: 52.1922, lng: 5.22619},
                    {lat: 52.08919, lng: 5.2109},
                    {lat: 52.09844, lng: 5.04369}
                  ]]
                }, {
                  id: "2118",
                  value: [[
                    {lat: 52.09844, lng: 5.04369},
                    {lat: 52.08919, lng: 5.2109},
                    {lat: 51.98625, lng: 5.1957},
                    {lat: 51.99546, lng: 5.02897}
                  ]]
                }]
              },
              timeFilter: {beginTimestamp: 1623974400000, stepSize: 1, endTimestamp: 1624060200000}
            }
          }, {
            name: "Amersfoort",
            templateType: "TemplateBarChartComponent",
            data: {
              map: {
                zoom: 8,
                centerLocation: {lat: 52.19091907418051, lng: 5.51513671875},
                mapType: "OpenStreetBW"
              },
              coordinatesFilter: {
                dataCompression: 3,
                pixels: [{
                  id: "2003",
                  value: [[
                    {lat: 52.29526, lng: 5.24157},
                    {lat: 52.28566, lng: 5.40966},
                    {lat: 52.18262, lng: 5.3938},
                    {lat: 52.1922, lng: 5.22619}
                  ]]
                }, {
                  id: "2004",
                  value: [[
                    {lat: 52.28566, lng: 5.40966},
                    {lat: 52.27574, lng: 5.57767},
                    {lat: 52.17275, lng: 5.56131},
                    {lat: 52.18262, lng: 5.3938}
                  ]]
                }, {
                  id: "2061",
                  value: [[
                    {lat: 52.1922, lng: 5.22619},
                    {lat: 52.18262, lng: 5.3938},
                    {lat: 52.07965, lng: 5.37802},
                    {lat: 52.08919, lng: 5.2109}
                  ]]
                }, {
                  id: "2062",
                  value: [[
                    {lat: 52.18262, lng: 5.3938},
                    {lat: 52.17275, lng: 5.56131},
                    {lat: 52.06981, lng: 5.54505},
                    {lat: 52.07965, lng: 5.37802}
                  ]]
                }]
              },
              timeFilter: {beginTimestamp: 1623974400000, stepSize: 1, endTimestamp: 1624060200000}
            }
          }]
        }
      ]
    }
  }
}
