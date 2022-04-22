import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
