import { Component, Input, OnInit } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FeatureService } from 'src/app/_services/feature.service';
import { Feature, FeatureDetails, ModifyFeatureInput } from '../../dht-common/models';

export enum UpdateColumnIdentifier {
  title = 1,
  description = 2,
  workCompletionPercentage = 3,
  status = 4,
  sprint = 5,
  storyPoint = 6,
  assignees = 7,
  isBlocked = 8
}

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.css']
})

export class FeatureDetailsComponent implements OnInit {

  modifyFeatureInput: ModifyFeatureInput = {
    id: -1,
    description: '',
    fieldName: 0,
    isBlocked: false,
    sprint: {
      createdBy: '',
      createdOn: new Date(),
      endDate: new Date(),
      lastModifiedBy: '',
      lastModifiedOn: new Date(),
      name: '',
      startDate: new Date()
    },
    status: 0,
    storyPoint: 0,
    title: '',
    workCompletionPercentage: 0
  };

  isBlocked = false;
  startDate: string = '';
  @Input() feature: Feature = {
    id: -1,
    moduleId: -1,
    title: ''
  };

  featureDetails: FeatureDetails = {
    id: -1,
    description: '',
    isBlocked: false,
    status: 0,
    storyPoint: 0,
    workCompletionPercentage: 0,
    title: ''
  };

  isAddTaskButtonActive: boolean = true;

  constructor(private calendar: NgbCalendar,
              private featureService: FeatureService) { }

  ngOnInit(): void {
    console.log(this.feature);
    this.featureService.getFeatureDetailsById(this.feature.id).subscribe(x => {
      this.featureDetails = x as FeatureDetails;
      this.modifyFeatureInput = this.featureDetails as ModifyFeatureInput;
      // this.modifyFeatureInput.title = this.featureDetails.title;
      // this.modifyFeatureInput.description = this.featureDetails.description;
      // this.modifyFeatureInput.id = this.featureDetails.id;
      // this.modifyFeatureInput.isBlocked = this.featureDetails.isBlocked;
      // this.modifyFeatureInput.status = this.featureDetails.status
      // this.modifyFeatureInput.storyPoint = this.featureDetails.storyPoint;
      // this.modifyFeatureInput.workCompletionPercentage = this.featureDetails.workCompletionPercentage;
    })
    // console.log(this.getTiming(new Date("Mar 5, 2021 21:13:00")));
    // console.log(this.getTiming(new Date("Mar 7, 2021 21:13:00")));
    // console.log(this.getEventTiming(new Date("Mar 8, 2021 18:13:00")));
    // console.log(this.getTiming(new Date("Mar 8, 2021 19:30:00")));
  }

  // getEventTiming(messageDateDate: Date) {
  //   let currentDate: Number = new Date().getTime();
  //   let messageDate: Number = messageDateDate.getTime();

  //   let time: Number = Math.abs((+currentDate) - (+messageDate));
    
  //   let t24hr = 24*60*60*1000; //24 hr in milliseconds
  //   let t1hr = 60*60*1000; //1 hr in milliseconds
  //   let t1min = 60*1000; //1 min in milliseconds

  //   let dayDiff: Number = Math.floor(+time / t24hr);
  //   let hrDiff: Number = Math.floor((+time % t24hr) / t1hr);
  //   let minDiff: Number = Math.floor(((+time % t24hr) % t1hr) / t1min);

  //   if(dayDiff >= 1)
  //     return messageDateDate.toLocaleString();
  //   if(hrDiff == 0)
  //     return minDiff + " min ago.";
  //   return hrDiff + " hr " + minDiff + " min ago."
  // }
  modifyFeature(key : number, value : string | any) {
    this.modifyFeatureInput.fieldName = key;
    if(key == UpdateColumnIdentifier.title) {
      this.modifyFeatureInput.title = value;
    }
    if(key == UpdateColumnIdentifier.description){
      this.modifyFeatureInput.description = value;
    }
    if(key == UpdateColumnIdentifier.workCompletionPercentage){
      this.modifyFeatureInput.workCompletionPercentage = +value;
    }
    this.featureService.modifyFeatureElement(this.modifyFeatureInput).subscribe(x => {
      console.log(x);
    })
  }
  onDateSelect(event: any){
    console.log(event);
  }
}
