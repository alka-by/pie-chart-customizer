import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PieConfigComponent } from './pie-config/pie-config.component';
import { PiePlainChartComponent } from './pie-plain-chart/pie-plain-chart.component';
import { PieTdChartComponent } from './pie-td-chart/pie-td-chart.component';
import { TeamsService } from './shared/teams.service';
import { TeamConfigComponent } from './pie-config/team-config/team-config.component';
import { ColorsService } from './shared/colors.service';

@NgModule({
  declarations: [
    AppComponent,
    PieConfigComponent,
    PiePlainChartComponent,
    PieTdChartComponent,
    TeamConfigComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [TeamsService, ColorsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
