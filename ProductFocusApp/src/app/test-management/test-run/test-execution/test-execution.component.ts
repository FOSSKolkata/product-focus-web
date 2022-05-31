import { Component, Input } from '@angular/core';
import { ITestRun, ITestRunCase, ITestRunStep, TestCaseResultEnum, TestStepResultEnum } from '../../models.ts';

@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.scss']
})
export class TestExecutionComponent {
  private _firstTestCaseSelected = false;
  @Input('testRun') testRun!: ITestRun;
  @Input('firstTestCaseSelected') set firstTestCaseSelected(firstTestCaseSelected: boolean) {
    this._firstTestCaseSelected = firstTestCaseSelected;
    if(!firstTestCaseSelected) {
      this.testSuiteExecutionPointer = 0;
      this.testCaseExecutionPointer = 0;
    } else {
      this.moveToNextTestCase();
    }
  }
  testSuiteExecutionPointer = 0;
  testCaseExecutionPointer = 0;
  constructor() { }

  moveToPreviousTestCase(): boolean {
    this.testCaseExecutionPointer--;

    if(this.arePointersCrossedTheLimitFromLeftSide()) {
      this.testCaseExecutionPointer = 0;
      this.testSuiteExecutionPointer = 0;
      this.moveToNextTestCase();
      return false;
    }

    if(this.isTestCasePointerLimitCrossedInLeftSide()) {
      this.testSuiteExecutionPointer --;
      this.testCaseExecutionPointer = this.testRun.testSuites[this.testSuiteExecutionPointer].testCases.length - 1;
    }

    return this.isTestCaseIncludedInCurrentPosition() || this.moveToPreviousTestCase();
  }
  
  moveToNextTestCase(): boolean {
    this.testCaseExecutionPointer++;

    if(this.arePointersCrossedTheLimit()) {
      this.testCaseExecutionPointer = 0;
      this.testSuiteExecutionPointer = 0;
      this.moveToNextTestCase();
      return false;
    }

    if(this.isTestCasePointerLimitCrossed()) {
      this.testCaseExecutionPointer = 0;
      this.testSuiteExecutionPointer ++;
    }

    return this.isTestCaseIncludedInCurrentPosition() || this.moveToNextTestCase();
  }

  private isTestCasePointerLimitCrossed(): boolean {
    return this.testRun.testSuites[this.testSuiteExecutionPointer].testCases.length <= this.testCaseExecutionPointer;
  }

  private isTestCasePointerLimitCrossedInLeftSide(): boolean {
    return this.testCaseExecutionPointer <= -1;
  }

  private isTestCaseIncludedInCurrentPosition(): boolean {
    if(this.testRun.testSuites[this.testSuiteExecutionPointer].testCases.length == this.testCaseExecutionPointer)
      return false;
    return this.testRun.testSuites[this.testSuiteExecutionPointer].testCases[this.testCaseExecutionPointer].isIncluded;
  }
  
  private arePointersCrossedTheLimit(): boolean {
    let totalSuite = this.testRun.testSuites.length;
    if(this.testSuiteExecutionPointer >= totalSuite) {
      return true;
    }if(this.testSuiteExecutionPointer == totalSuite - 1)
      return this.testCaseExecutionPointer >= this.testRun.testSuites[this.testSuiteExecutionPointer].testCases.length;
    return false;
  }

  private arePointersCrossedTheLimitFromLeftSide(): boolean {
    if(this.testSuiteExecutionPointer <= -1) {
      return true;
    }if(this.testSuiteExecutionPointer == 0)
      return this.testCaseExecutionPointer <= -1;
    return false;
  }

  markTestCaseStatus(status: TestCaseResultEnum, testCase: ITestRunCase): void {
    testCase.resultStatus = status;
  }

  markTestStepStatus(status: TestStepResultEnum, testStep: ITestRunStep): void {
    testStep.resultStatus = status;
  }

  isAtleastOneTestCaseSelected(): boolean {
    let atLeastOneSelected = false;
    this.testRun.testSuites.forEach(tsuite => {
      tsuite.testCases.forEach(tcase => {
        atLeastOneSelected ||= tcase.isIncluded;
      });
    });
    return atLeastOneSelected;
  }

  get testCaseResultEnum(): typeof TestCaseResultEnum {
    return TestCaseResultEnum;
  }
  
  get testStepResultEnum(): typeof TestStepResultEnum {
    return TestStepResultEnum;
  }

}