import { Team } from '../model/team.model';
import { Subscription, Subject } from 'rxjs';

export class TeamsService {
  teamsChanged = new Subject<Team[]>();

  private teams: Team[] = [
    new Team('DronBaton', 4, 'rgb(255, 99, 132)'),
    new Team('Veterok', 5, 'rgb(255, 99, 132)'),
    new Team('PropVoshki', 3, 'rgb(255, 99, 132)'),
    new Team('BeeDro', 2, 'rgb(255, 99, 132)'),
    new Team('Zadroni', 4, 'rgb(255, 99, 132)'),
    new Team('AronDonDron', 3, 'rgb(255, 99, 132)')
  ];

  getTeams() {
    return this.teams;
  }

  updateTeamInfo(index: number, updated: Team) {
    this.teams[index] = updated;
    this.teamsChanged.next(this.teams);
  }

  updateTeamName(index: number, updName: string) {
    this.teams[index].name = updName;
    this.teamsChanged.next(this.teams);
  }

  updateTeamWins(index: number, updWins: number) {
    this.teams[index].wins = updWins;
    this.teamsChanged.next(this.teams);
  }
}
