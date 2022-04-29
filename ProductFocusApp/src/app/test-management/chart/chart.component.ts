import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  title = 'dashboard';
  chart: any = [];
  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.chart = new Chart('canvas',{
      type: 'pie',
      data: {
        labels: ['Passed', 'Failed', 'Skipped', 'Pending'],
        datasets: [
          {
            data: [1,3,5,10],
            backgroundColor: ['green','red','blue','yellow'],
            borderColor: 'rgba(225,225,225,0.1)'
          }
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
          }
        }
      },
    })
  }

}
