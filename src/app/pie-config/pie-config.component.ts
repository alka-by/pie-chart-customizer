import { Component, OnInit, OnDestroy } from '@angular/core';
import { Team } from '../model/team.model';
import { TeamsService } from '../shared/teams.service';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColorsService } from '../shared/colors.service';
import { Color } from '../shared/Color';

@Component({
  selector: 'app-pie-config',
  templateUrl: './pie-config.component.html',
  styleUrls: ['./pie-config.component.scss']
})
export class PieConfigComponent implements OnInit, OnDestroy {
  title = 'Your teams success';
  teams: Team[];
  subscription: Subscription;
  colors: string[];

  constructor(private teamsService: TeamsService, private colorsService: ColorsService) {}

  ngOnInit() {
    this.teams = this.teamsService.getTeams();
    this.subscription = this.teamsService.teamsChanged.subscribe((teams: Team[]) => {
      this.teams = teams;
    });
    this.colors = this.colorsService.getColors().map((color: Color) => {
      return color.base;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
