import { Component, OnInit } from '@angular/core';
import { Team } from '../model/team.model';
import { TeamsService } from '../shared/teams.service';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pie-config',
  templateUrl: './pie-config.component.html',
  styleUrls: ['./pie-config.component.scss']
})
export class PieConfigComponent implements OnInit {

  title = "Your teams success";
  teams: Team[];
  subscription: Subscription;

  constructor(private teamsService: TeamsService) { }

  ngOnInit() {
    this.teams = this.teamsService.getTeams();
    this.subscription = this.teamsService.teamsChanged.subscribe(
      (teams: Team[]) => {
        this.teams = teams;
      }
    );
  }


}
