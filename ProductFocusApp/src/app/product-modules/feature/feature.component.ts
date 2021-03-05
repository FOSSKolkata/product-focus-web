import { Component, Input, OnInit } from '@angular/core';
import { Feature } from '../modal';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit {

  @Input() feature: Feature = {
    title: '',
    startDate: '',
    endDate: '',
    noOfComments: 0,
    noOfTask: 0,
    noOfTaskCompleted: 0,
  };

  constructor() { }

  ngOnInit(): void {
  }

}