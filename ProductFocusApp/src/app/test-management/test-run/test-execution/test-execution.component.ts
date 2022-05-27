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
}