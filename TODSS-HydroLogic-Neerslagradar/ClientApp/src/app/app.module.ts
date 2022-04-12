import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';




import {NgChartsModule} from "ng2-charts";
import { AppComponent } from './app.component';
import { HomeComponent, ViewDirective } from './home/home.component';
import { ViewComponent, TemplateDirective } from './view/view.component';
import { TemplateSelectComponent } from './templates/template-select/template-select.component';
import { TemplateTestComponent } from './templates/template-test/template-test.component';
import { AnimationMapComponent } from './components/animation-map/animation-map.component';
import { TemplateFullMapComponent } from './templates/template-full-map/template-full-map.component';
import { ConfigurationSelectComponent } from './configuration-select/configuration-select.component';
import {LineChartComponent} from "./components/line-chart/line-chart.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ViewComponent,
    TemplateSelectComponent,
    ViewDirective,
    TemplateDirective,
    TemplateTestComponent,
    AnimationMapComponent,
    TemplateFullMapComponent,
    ConfigurationSelectComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/configurations', pathMatch: 'full' },
      { path: 'home', component: HomeComponent},
      { path: 'configurations', component: ConfigurationSelectComponent },
      { path: '**', redirectTo:'/configurations' }
    ]),
    LeafletModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
