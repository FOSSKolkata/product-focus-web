import { Component, Input, OnInit } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Feature } from '../model';

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.css']
})
export class FeatureDetailsComponent implements OnInit {

  @Input() feature: Feature = {
    title: '',
    startDate: '',
    endDate: '',
    noOfComments: 0,
    noOfTask: 0,
    noOfTaskCompleted: 0
  };
  isAddTaskButtonActive: boolean = true;

  constructor(private calendar: NgbCalendar) { }

  ngOnInit(): void {
    // console.log(this.getTiming(new Date("Mar 5, 2021 21:13:00")));
    // console.log(this.getTiming(new Date("Mar 7, 2021 21:13:00")));
    console.log(this.getEventTiming(new Date("Mar 8, 2021 18:13:00")));
    // console.log(this.getTiming(new Date("Mar 8, 2021 19:30:00")));
  }

  getEventTiming(messageDateDate: Date){
    let currentDate: Number = new Date().getTime();
    let messageDate: Number = messageDateDate.getTime();

    let time: Number = Math.abs((+currentDate) - (+messageDate));
    
    let t24hr = 24*60*60*1000; //24 hr in milliseconds
    let t1hr = 60*60*1000; //1 hr in milliseconds
    let t1min = 60*1000; //1 min in milliseconds

    let dayDiff: Number = Math.floor(+time / t24hr);
    let hrDiff: Number = Math.floor((+time % t24hr) / t1hr);
    let minDiff: Number = Math.floor(((+time % t24hr) % t1hr) / t1min);

    if(dayDiff >= 1)
      return messageDateDate.toLocaleString();
    if(hrDiff == 0)
      return minDiff + " min ago.";
    return hrDiff + " hr " + minDiff + " min ago."
  }
}
