import { Component, OnInit } from '@angular/core';
import { ITemplate } from "../i-template.view";

@Component({
  selector: 'template-full-map',
  templateUrl: './template-full-map.component.html',
  styleUrls: ['./template-full-map.component.css']
})
export class TemplateFullMapComponent implements OnInit, ITemplate {

  constructor() { }

  ngOnInit(): void {
  }

}
