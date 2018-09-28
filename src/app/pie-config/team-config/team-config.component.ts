import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Team } from '../../model/team.model';
import { NgForm } from '@angular/forms';
import { TeamsService } from '../../shared/teams.service';

@Component({
  selector: 'app-team-config',
  templateUrl: './team-config.component.html',
  styleUrls: ['./team-config.component.scss']
})
export class TeamConfigComponent implements OnInit {
  @Input()
  team: Team;
  @Input()
  index: number;
  @Input()
  color: string;

  constructor(private teamsService: TeamsService) {}

  ngOnInit() {}

  onUpdate(form: NgForm) {
    this.teamsService.updateTeamInfo(this.index, form.value);
  }

  onChangeName(event: Event) {
    this.teamsService.updateTeamName(this.index, (<HTMLInputElement>event.target).value);
  }

  onChangeWins(event: Event) {
    this.teamsService.updateTeamWins(this.index, +(<HTMLInputElement>event.target).value);
  }
}
