import { Component, OnInit } from '@angular/core';
enum TestCaseMode {
  Add = 1,
  Update = 2
}
@Component({
  selector: 'app-test-suites',
  templateUrl: './test-suites.component.html',
  styleUrls: ['./test-suites.component.scss']
})
export class TestSuitesComponent implements OnInit {

  productDocumentationsMock: string[] = ["documentation 1", "documentation 2"];
  selectedDocumentationMock = this.productDocumentationsMock[0];
  addSuiteVisible = true;
  testStepsMock: {step: number, action: string, expectedResult: string}[] = [];
  modeMock = TestCaseMode.Update;
  constructor() {}

  ngOnInit(): void {
    
  }

  addSuiteVisibilityToggle(visibility: boolean) {
    this.addSuiteVisible = visibility;
  }

  addTestStepMock() {
    this.testStepsMock.push({step: this.testStepsMock.length + 1, action: '', expectedResult: ''});
  }

  removeTestStepMock(step: number) {
    this.testStepsMock = this.testStepsMock.filter(testStep => testStep.step != step);
    this.testStepsMock.map((testStep, index) => {
      testStep.step = index + 1;
    });
  }

  get testCaseModeMock() : typeof TestCaseMode {
    return TestCaseMode;
  }

}
