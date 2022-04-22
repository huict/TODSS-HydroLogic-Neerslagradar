import { Component, OnInit } from '@angular/core';
import {ConfigurationManager} from "./configuration.manager";
import {IConfiguration} from "../home/home.component";

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

  constructor(public manager:ConfigurationManager) { }

  ngOnInit(): void {
  }

  getAllConfigs() : IConfiguration[]{
    console.log(Object.values(this.manager.getAllConfigs()))
    return Object.values(this.manager.getAllConfigs())
  }

}
