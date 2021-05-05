import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProductModule } from '../kanban-board/models';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  dummy: ProductModule[] = [
    {
      name: "Medications",
      // features: [
      //   {
      //     title : "PNR medication needs to transfer to a new tab.",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 5
      //   },{
      //     title : "PNR medication needs to transfer to a new tab.",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 3
      //   }    
      // ]
    },{
      name: "Vital",
      // features: [
      //   {
      //     title : "New API integration",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 5
      //   }
      // ]
    },{
      name: "Vital",
      // features: [
      //   {
      //     title : "New API integration",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 5
      //   }
      // ]
    },{
      name: "Telehealth",
      // features: [
      //   {
      //     title : "Need a call verification step.",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 5
      //   },{
      //     title : "PNR medication needs to transfer to a new tab.",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 3
      //   },{
      //     title : "PNR medication needs to transfer to a new tab.",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 3
      //   },{
      //     title : "Need a call verification step.",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 5
      //   },{
      //     title : "PNR medication needs to transfer to a new tab.",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 3
      //   },{
      //     title : "PNR medication needs to transfer to a new tab.",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 3
      //   },
      // ]
    },{
      name: "Vital",
      // features: [
      //   {
      //     title : "New API integration",
      //     startDate : " 13 Jan",
      //     endDate : " 1 Feb",
      //     noOfComments : 2,
      //     noOfTaskCompleted : 3,
      //     noOfTask : 5
      //   }
      // ]
    }
  ];
  constructor() { }
  getModules(): Observable<ProductModule[]>{
   return of(this.dummy).pipe(delay(1000));
  }
}


