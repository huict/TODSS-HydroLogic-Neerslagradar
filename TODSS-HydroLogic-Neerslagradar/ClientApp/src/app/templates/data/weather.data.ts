export class WeatherData {
  // TODO add demensions. Width and height of selection
  // TODO add total surface area

  // TODO add total list of amounts of rainfall per step
  // TODO add rainfall per step per surface area
  // TODO add total amount of rainfall
  // TODO add total rainfall per surface area
}

// misschien wel handig om hiervoor een builder patern te gebruiken
export class WeatherBuilder {

  constructor() {}

  build(): WeatherData {
    return new WeatherData();
  }
}
