import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-run-results',
  templateUrl: './test-run-results.component.html',
  styleUrls: ['./test-run-results.component.scss']
})
export class TestRunResultsComponent implements OnInit {
  searchTestTypeMock = null;
  testTypesMock = ['Regression', 'Work Item Based'];
  testersMock = ['Vikram shaw', 'Amit shah', 'Sandeep singh'];
  selectedTesters = null;
  ngOnInit(): void { }
  
}
