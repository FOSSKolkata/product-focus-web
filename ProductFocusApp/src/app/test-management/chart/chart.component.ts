import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TestResultCounter } from '../models.ts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  title = 'dashboard';
  private _counter: TestResultCounter = {success: 1, failure: 1, blocked: 1, total: 1};
  @Input('counter') set counter(count: TestResultCounter) {
    this._counter = count;
    let data = [count.success, count.failure, count.blocked,
      count.total - count.success - count.blocked - count.failure];
    if(this.chart.length != 0) {
      this.chart.config.data.datasets[0].data = data;
      this.chart.update();
    }
  }
  get counter(): TestResultCounter {
    return this._counter;
  }
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
            data: [this._counter.success, this._counter.failure, this._counter.blocked,
              this._counter.total - this._counter.success - this._counter.blocked - this._counter.failure],
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
    });
  }
}
