import { Component, OnInit, Directive, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IViewData, ViewComponent } from "../view/view.component";
import { ConfigurationManager } from "../configuration-select/configuration.manager";

@Directive({
  selector: '[views]',
})
export class ViewDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(ViewDirective, {static: true}) viewHost!: ViewDirective
  private _views: ViewComponent[] = [];
  public configId: number | undefined;
  public settingsOpen: boolean = false;
  public saveConfigOpen: boolean = false;
  public configTitle: string = "";
  public configDescription: string = "";

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

  public addView(data? : IViewData): ViewComponent {
    const newView = this.viewHost.viewContainerRef.createComponent(ViewComponent).instance;
    newView.removeEvent.subscribe(event => {
      newView.removeEvent.unsubscribe();
      this.removeView(event.valueOf());
    })
    this._views.push(newView);
    if (data) newView.data = data;
    this.reIndex();
    return newView
  }

  public removeView(index: number) {
    this._views = this._views.filter((value, i) => index != i);
    this.viewHost.viewContainerRef.remove(index);
    this.reIndex();
  }

  private reIndex() {
    this._views.forEach((value, i) => value.index = i);
  }

  private loadConfig() {
    if (this.configId) {
      let data = this.configManager.getConfig(this.configId);
      console.log(data);
      for (const viewData of data.views) {
        this.addView(viewData);
      }
      this.configTitle = data.title;
      this.configDescription = data.description;
    }
  }

  public saveConfig() {
    let configIdWasSet = true;
    if (!this.configId) {
      this.configId = this.configManager.getNewIndex();
      configIdWasSet = false;
    }

    let obj = {id:this.configId, title:this.configTitle, description:this.configDescription, views:this.views.map(v => v.data)};
    console.log(obj)
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

// TODO extra onderdelen toevoegen voor een configuratie
export interface IConfiguration {
  id: number;
  title: string;
  description: string;
  views: IViewData[];
}
