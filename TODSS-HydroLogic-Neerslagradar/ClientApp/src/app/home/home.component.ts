import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewComponent } from "../view/view.component";
import { ConfigurationManager } from "../configuration-select/configuration.manager";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _views: ViewComponent[] = [];
  configId: number | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private configManager: ConfigurationManager) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty("config")) {
        this.configId = params.config;
        this.loadConfig();
      }
    });
  }

  get views(): ViewComponent[] {
    return this._views;
  }

  public addView() {
    this._views.push(new ViewComponent());
    this.reIndex();
  }

  public removeView(index: number) {
    this._views = this._views.filter((value, i) => index != i);
    this.reIndex();
  }

  private reIndex() {
    this._views.forEach((value, i) => value.index = i);
  }

  public openSettings() {
    // TODO display settings
    console.log("to be implemented")
  }

  private loadConfig() {
    if (this.configId) {
      let data = this.configManager.getConfig(this.configId);
      console.log(data);
      // TODO load config data
    }
  }

  private saveConfig() {
    let configIdWasSet = true;
    if (!this.configId) {
      this.configId = this.configManager.getNewIndex();
      configIdWasSet = false;
    }

    // TODO create config data
    let obj = {name:"test"};
    this.configManager.saveConfig(this.configId, obj);

    if (!configIdWasSet) {
      const urlTree = this.router.createUrlTree([], {
        queryParams: { config: this.configId },
        queryParamsHandling: "merge",
        preserveFragment: true });
      this.router.navigateByUrl(urlTree);
    }
  }
}
