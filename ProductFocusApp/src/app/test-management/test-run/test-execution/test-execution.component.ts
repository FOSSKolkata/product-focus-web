import { Component, Input } from '@angular/core';
import { ITestRun } from '../../models.ts';

@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.scss']
})
export class TestExecutionComponent {
  @Input('testRun') testRun!: ITestRun;
  testSuiteExecutionPointer = 0;
  testCaseExecutionPointer = 0;
  constructor() {}

  moveToPreviousTestCase(): boolean {
    this.testCaseExecutionPointer--;

    if(this.arePointersCrossedTheLimitFromLeftSide()) {
      this.testCaseExecutionPointer = 0;
      this.testSuiteExecutionPointer = 0;
      console.log('Reached starting position');
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
      console.log('Execution completed');
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
}