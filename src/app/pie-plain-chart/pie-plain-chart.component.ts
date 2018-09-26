import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js';
import { Team } from '../model/team.model';
import { TeamsService } from '../shared/teams.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-pie-plain-chart',
  templateUrl: './pie-plain-chart.component.html',
  styleUrls: ['./pie-plain-chart.component.scss']
})
export class PiePlainChartComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  myChart: Chart;
  teams: Team[];
  subscription: Subscription;

  constructor(private teamsService: TeamsService) { }

  ngOnInit() {
    this.teams = this.teamsService.getTeams();
    this.ctx = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');

    this.drawChart(this.getLabels(), this.getWins());

    this.subscription = this.teamsService.teamsChanged.subscribe(
      (teams: Team[]) => {
        this.teams = teams;
        this.updateChart();
      }
    );
  }

  getLabels() {
    return this.teams.map((team: Team) => { return team.name });
  }

  getWins() {
    return this.teams.map((team: Team) => { return team.wins });
  }

  drawChart(labels: string[], data: number[]) {
    this.myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: [...labels],
        datasets: [{
          data: [...data],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      responsive: true,
      options: {
        legend: {
          position: 'left'
        }
      }
    });
  }

  updateChart() {
    console.log(this.myChart);
    this.myChart.config.data.datasets[0].data.forEach((element, index) => {
      if (element != this.teams[index].wins) {
        this.myChart.config.data.datasets[0].data[index] = this.teams[index].wins;
      }
    });
    this.myChart.config.data.labels.forEach((element, index) => {
      if (element != this.teams[index].name) {
        this.myChart.config.data.labels[index] = this.teams[index].name;
      }
    });
    this.myChart.update();
  }

}
