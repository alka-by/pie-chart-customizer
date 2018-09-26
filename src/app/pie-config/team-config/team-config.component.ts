import { Component, OnInit, Input } from '@angular/core';
import { Team } from '../../model/team.model';
import { NgForm } from '@angular/forms';
import { TeamsService } from '../../shared/teams.service';

@Component({
  selector: 'app-team-config',
  templateUrl: './team-config.component.html',
  styleUrls: ['./team-config.component.scss']
})
export class TeamConfigComponent implements OnInit {

  @Input() team: Team;
  @Input() index: number;

  constructor(private teamsService: TeamsService) { }

  ngOnInit() {
  }

  onUpdate(form: NgForm) {
    this.teamsService.updateTeamInfo(this.index, form.value);
    console.log(form);
    console.log(this.team);
  }

}
