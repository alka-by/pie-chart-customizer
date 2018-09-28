import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import Chart from 'chart.js';
import { Team } from '../model/team.model';
import { TeamsService } from '../shared/teams.service';
import { Subscription } from 'rxjs';
import { Color } from '../shared/Color';
import { ColorsService } from '../shared/colors.service';

@Component({
  selector: 'app-pie-plain-chart',
  templateUrl: './pie-plain-chart.component.html',
  styleUrls: ['./pie-plain-chart.component.scss']
})
export class PiePlainChartComponent implements OnInit, OnDestroy {
  @ViewChild('canvas')
  canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  myChart: Chart;
  teams: Team[];
  subscription: Subscription;
  colors: Color[];

  constructor(private teamsService: TeamsService, private colorsService: ColorsService) {}

  ngOnInit() {
    this.colors = this.colorsService.getColors();
    this.teams = this.teamsService.getTeams();
    this.ctx = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');

    this.drawChart(this.getLabels(), this.getWins());

    this.subscription = this.teamsService.teamsChanged.subscribe((teams: Team[]) => {
      this.teams = teams;
      this.updateChart();
    });
  }

  getLabels() {
    return this.teams.map((team: Team) => {
      return team.name;
    });
  }

  getWins() {
    return this.teams.map((team: Team) => {
      return team.wins;
    });
  }

  drawChart(labels: string[], data: number[]) {
    const bgColors = [
      ...this.colors.map((color: Color) => {
        return color.transparent;
      })
    ];

    const bColors = [
      ...this.colors.map((color: Color) => {
        return color.base;
      })
    ];
    this.myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: [...labels],
        datasets: [
          {
            data: [...data],
            backgroundColor: bgColors,
            borderColor: bColors,
            borderWidth: 1
          }
        ]
      },
      responsive: true,
      options: {
        legend: {
          display: false,
          position: 'left'
        }
      }
    });
  }

  updateChart() {
    this.myChart.config.data.datasets[0].data.forEach((element, index) => {
      if (element !== this.teams[index].wins) {
        this.myChart.config.data.datasets[0].data[index] = this.teams[index].wins;
      }
    });
    this.myChart.config.data.labels.forEach((element, index) => {
      if (element !== this.teams[index].name) {
        this.myChart.config.data.labels[index] = this.teams[index].name;
      }
    });
    this.myChart.update();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
