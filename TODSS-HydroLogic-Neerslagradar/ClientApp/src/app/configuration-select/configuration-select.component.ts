import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {ConfigurationManager} from "./configuration.manager";
import {IConfiguration} from "../home/home.component";
import {DOCUMENT} from "@angular/common";

/**
 * A selection component that gives a brief summary of each saved configuration that can be selected or removed.
 * An empty configuration can allso be selected.
 */
@Component({
  selector: 'app-configuration-select',
  templateUrl: './configuration-select.component.html',
  styleUrls: ['./configuration-select.component.css']
})
export class ConfigurationSelectComponent implements OnInit {
  showMe:boolean=false

  constructor(
    public manager:ConfigurationManager,
  ) { }

  ngOnInit(): void {
  }

  getAllConfigs() : IConfiguration[]{
    return Object.values(this.manager.getAllConfigs())
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.showMe = window.scrollY != 0;
  }

  scrollTop(){
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  deleteConfig(id: number){
    this.manager.removeConfig(id);
  }
}
