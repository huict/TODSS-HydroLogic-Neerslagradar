import { WeatherData } from "./data/weather.data";
import { Filters } from "./data/filters.data";
import { ITemplate } from "./i-template.view";

export interface IWeatherView extends ITemplate {
  getData(): WeatherData | undefined;
  getFilters(): Filters | undefined;
}
