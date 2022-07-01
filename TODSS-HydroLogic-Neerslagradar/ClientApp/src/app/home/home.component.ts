import { Component, OnInit, Directive, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IViewData, ViewComponent } from "../view/view.component";
import { ConfigurationManager } from "../configuration-select/configuration.manager";
import {Subscription} from "rxjs";

/**
 * Used to manage the container of views so that they can be added and removed easily and so that we can get a
 * association to the element in the dom.
 */
@Directive({
  selector: '[views]',
})
export class ViewDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

/**
 * The main page of the application. This is the main container of all the views the user wants to see. Configurations
 * and application wide settings can also be managed here.
 */
@Component({
  selector: 'app-home',
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
  private _routeParamSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private configManager: ConfigurationManager) {}

  ngOnInit(): void {
    this._routeParamSubscription = this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty("config")) {
        this.configId = parseInt(params.config);
        this.loadConfig();
        this._routeParamSubscription?.unsubscribe();
      }
    });
  }

  get views(): ViewComponent[] {
    return this._views;
  }

  /**
   * Adds a view to the end of a container.
   * @param data (optional) data from the configuration. Try not to create this data by hand, a view is responsible for
   * its own data. So it is only used to load from a configuration.
   */
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

  /**
   * Removes the view at index.
   * @param index index
   */
  public removeView(index: number) {
    this._views = this._views.filter((value, i) => index != i);
    this.viewHost.viewContainerRef.remove(index);
    this.reIndex();
  }

  // Indexes all the views again so that they know themself where they are in the container
  private reIndex() {
    this._views.forEach((value, i) => value.index = i);
  }

  private loadConfig() {
    if (this.configId !== undefined) {
      let config = this.configManager.getConfig(this.configId);
      if (config) {
        for (const viewData of config.views) {
          this.addView(viewData);
        }
        this.configTitle = config.title;
        this.configDescription = config.description;
      }
    }
  }

  public saveConfig() {
    let configIdWasSet = true;

    // Check if a new config was selected
    if (this.configId === undefined) {
      this.configId = this.configManager.getNewIndex();
      configIdWasSet = false;
    }

    // Construct the configuration
    let obj = {id:this.configId, title:this.configTitle, description:this.configDescription, views:this.views.map(v => v.data)};
    this.configManager.saveConfig(this.configId, obj);

    // If this is a new configuration, change the url to match the new configuration
    if (!configIdWasSet) {
      this._routeParamSubscription?.unsubscribe();
      const urlTree = this.router.createUrlTree([], {
        queryParams: { config: this.configId },
        queryParamsHandling: "merge",
        preserveFragment: true });
      this.router.navigateByUrl(urlTree);
    }

    this.saveConfigOpen = false;
  }
}

// TODO extra onderdelen toevoegen voor een configuratie
/**
 * The interface for a configuration. Configurations can be loaded in and saved in the main view (home) component.
 */
export interface IConfiguration {
  id: number;
  title: string;
  description: string;
  views: IViewData[];
}
