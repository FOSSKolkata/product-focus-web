import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-run-result',
  templateUrl: './test-run-result.component.html',
  styleUrls: ['./test-run-result.component.scss']
})
export class TestRunResultComponent implements OnInit {
  suitesMock: any[] = [{
    id: 1,
    title: '$Test suite title 1',
    completed: false,
    testcases: [
      {
        title: '$Test case title 1', completed: false,
        testSteps: [
          {
            action: 'Navigate to website',
            expectedResult: '',
            status: true
          },{
            action: 'Enter Username (vikram_shaw)',
            expectedResult: '',
            status: true
          },{
            action: 'Enter Password (vikram_shaw)',
            expectedResult: '',
            status: true
          },{
            action: 'Click on Login button',
            expectedResult: 'Logged into the system and redirect to home page.',
            status: false
          }
        ]
      },{
        title: '$Test case title 2', completed: false,
        testSteps: [
          {
            action: 'Navigate to website',
            expectedResult: '',
            status: true
          },{
            action: 'Enter Username (vikram_shaw)',
            expectedResult: '',
            status: true
          },{
            action: 'Enter Password (vikram_shaw)',
            expectedResult: '',
            status: true
          },{
            action: 'Click on Login button',
            expectedResult: 'Logged into the system and redirect to home page.',
            status: false
          }
        ]
      },{
        title: '$Test case title 3', completed: false
      },
    ],
  },{
    id: 2,
    title: '$Test suite title 2',
    completed: false,
    testcases: [
      {title: '$Test case title 1', completed: false},
      {title: '$Test case title 2', completed: false},
    ],
  }];
  constructor() { }

  ngOnInit(): void {
  }

}
