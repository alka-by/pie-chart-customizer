import { Team } from "../model/team.model";
import { Subscription, Subject } from "rxjs";

export class TeamsService {
  teamsChanged = new Subject<Team[]>();

  private teams: Team[] = [
    new Team("DronBaton", 6),
    new Team("Veterok", 2),
    new Team("AronDonDron", 3)
  ];

  getTeams() {
    return this.teams;
  }

  updateTeamInfo(index: number, updated: Team) {
    this.teams[index] = updated;
    this.teamsChanged.next(this.teams);
  }
}