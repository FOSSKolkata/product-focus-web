import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FeatureService } from 'src/app/_services/feature.service';
import { Feature, FeatureDetails } from '../../dht-common/models';

export enum ModifyColumnIdentifier {
  title = 1,
  description = 2,
  workCompletionPercentage = 3,
  status = 4,
  sprint = 5,
  storyPoint = 6,
  isBlocked = 7,
  includeAssignee = 8,
  excludeAssignee = 9,
  acceptanceCriteria = 10,
  plannedStartDate = 11,
  plannedEndDate = 12,
  actualStartDate = 13,
  actualEndDate = 14
}

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.css']
})

export class FeatureDetailsComponent implements OnInit {

  @Output('any-changes') anyChanges = new EventEmitter<boolean>();
  isBlocked = false;
  startDate!: NgbDateStruct;
  endDate!: NgbDateStruct;
  @Input() feature: Feature = {
    id: -1,
    moduleId: -1,
    title: '',
    status: 0,
    isBlocked: false,
    workItemType: 0,
    plannedStartDate: new Date(),
    plannedEndDate: new Date(),
    actualStartDate: new Date(),
    actualEndDate: new Date()
  };

  featureDetails: FeatureDetails = {
    id: -1,
    description: '',
    isBlocked: false,
    status: 0,
    storyPoint: 0,
    workCompletionPercentage: 0,
    title: '',
    assignees: [],
    acceptanceCriteria: '',
    actualEndDate: new Date(),
    actualStartDate: new Date(),
    plannedEndDate: new Date(),
    plannedStartDate: new Date()
  };

  isAddTaskButtonActive: boolean = true;

  constructor(private calendar: NgbCalendar,
              private featureService: FeatureService) { }

  ngOnInit(): void {
    var date = this.featureDetails.actualStartDate;
    console.log(this.featureDetails.plannedStartDate);
    this.featureService.getFeatureDetailsById(this.feature.id).subscribe(x => {
      console.log(x);
      this.featureDetails = x as FeatureDetails;
      this.startDate = this.dateToNgbDate(new Date(this.featureDetails.plannedStartDate));
      this.endDate = this.dateToNgbDate(new Date(this.featureDetails.plannedEndDate));
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
  modifyFeature(key : number, value : any) {
    this.anyChanges.emit(true);
    var object: any = {}
    object.id = this.feature.id;
    object.fieldName = key;
    if(key == ModifyColumnIdentifier.title) {
      object.title = value;
    }
    else if(key == ModifyColumnIdentifier.description){
      object.description = value;
    }
    else if(key == ModifyColumnIdentifier.workCompletionPercentage){
      object.workCompletionPercentage = value;
    }
    else if(key == ModifyColumnIdentifier.acceptanceCriteria){
      object.acceptanceCriteria = value;
    }
    else if(key == ModifyColumnIdentifier.plannedStartDate){
      object.plannedStartDate = this.ngbDateToDate(value);
    }
    else if(key == ModifyColumnIdentifier.plannedEndDate){
      object.plannedEndDate = this.ngbDateToDate(value);
    }
    else if(key == ModifyColumnIdentifier.isBlocked){
      object.isBlocked = value;
      this.featureDetails.isBlocked = value; // do not need to call api again
    }
    this.featureService.modifyFeatureElement(object).subscribe(x => {
      console.log(x);
    })
  }

  dateToNgbDate(date: Date): NgbDateStruct {
    return { day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear()
    };
  }
  ngbDateToDate(ngbDate: NgbDateStruct){
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day + 1);
  }

  public get modifyColumnIdentifier(): typeof ModifyColumnIdentifier {
    return ModifyColumnIdentifier;
  }
}
