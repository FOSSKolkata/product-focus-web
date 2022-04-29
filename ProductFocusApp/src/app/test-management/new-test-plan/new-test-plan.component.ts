import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-test-plan',
  templateUrl: './new-test-plan.component.html',
  styleUrls: ['./new-test-plan.component.scss']
})
export class NewTestPlanComponent implements OnInit {

  sprints = ["sprint1", "sprint2", "sprint3"]
  testTypes = ["Work item based", "Regression"]
  selectedSprint = this.sprints[0];
  selectedType = this.testTypes[0];
  constructor() { }

  ngOnInit(): void {
  }

}
