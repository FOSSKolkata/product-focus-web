import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMarkTestCaseVersionStatus, IMarkTestStepVersionStatus, ITestRun, ITestRunCase, ITestRunStep, TestCaseResultEnum, TestResultCounter, TestStepResultEnum } from '../../models';
import { TestRunService } from '../../_services/test-run.service';

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
  currentExecutingNumber = 0;
  @Output('testResultCounter') testResultCountEmitter = new EventEmitter<TestResultCounter>();
  testSuiteExecutionPointer = 0;
  testCaseExecutionPointer = 0;
  constructor(private testRunService: TestRunService,
    private tostr: ToastrService) { }

  moveToPreviousTestCase(): boolean {
    this.testCaseExecutionPointer--;

    if(this.arePointersCrossedTheLimitFromLeftSide()) {
      this.testCaseExecutionPointer = 0;
      this.testSuiteExecutionPointer = 0;
      this.currentExecutingNumber = 1;
      // this.moveToNextTestCase();
      return false;
    }

    if(this.isTestCasePointerLimitCrossedInLeftSide()) {
      this.testSuiteExecutionPointer --;
      this.testCaseExecutionPointer = this.testRun.testSuites[this.testSuiteExecutionPointer].testCases.length - 1;
    }
    if(this.testRun.testSuites[this.testSuiteExecutionPointer].testCases[this.testCaseExecutionPointer].isIncluded) {
      this.currentExecutingNumber--;
    }

    return this.isTestCaseIncludedInCurrentPosition() || this.moveToPreviousTestCase();
  }
  
  moveToNextTestCase(): boolean {
    this.testCaseExecutionPointer++;

    if(this.arePointersCrossedTheLimit()) {
      this.testCaseExecutionPointer = 0;
      this.testSuiteExecutionPointer = 0;
      this.currentExecutingNumber = 1;
      // this.moveToNextTestCase();
      return false;
    }

    if(this.isTestCasePointerLimitCrossed()) {
      this.testCaseExecutionPointer = 0;
      this.testSuiteExecutionPointer ++;
    }

    if(this.testRun.testSuites[this.testSuiteExecutionPointer].testCases[this.testCaseExecutionPointer].isIncluded) {
      this.currentExecutingNumber++;
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
    this.emitCounter();
    let updatedTestCase: IMarkTestCaseVersionStatus = {id: testCase.id, resultStatus: testCase.resultStatus};
    this.testRunService.markTestCaseStatusVersion(this.testRun.id, updatedTestCase).subscribe(x => {

    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }

  markTestStepStatus(status: TestStepResultEnum, testStep: ITestRunStep): void {
    testStep.resultStatus = status;
    let updatedTestStep: IMarkTestStepVersionStatus = {id: testStep.id, resultStatus: testStep. resultStatus};
    this.testRunService.markTestStepStatusVersion(this.testRun.id, updatedTestStep).subscribe(x => {

    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
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

  emitCounter() {
    let success = 0, failure = 0, blocked = 0, total = 0;
    this.testRun.testSuites.forEach(testsuite => {
      testsuite.testCases.forEach(testcase => {
        if(testcase.isIncluded) {
          success += testcase.resultStatus === TestCaseResultEnum.Success ? 1 : 0;
          failure += testcase.resultStatus === TestCaseResultEnum.Failed ? 1 : 0;
          blocked += testcase.resultStatus === TestCaseResultEnum.Blocked ? 1 : 0;
          total ++;
        }
      });
    });
    this.testResultCountEmitter.emit({success: success, failure: failure, blocked: blocked, total: total});
  }

  get testCaseResultEnum(): typeof TestCaseResultEnum {
    return TestCaseResultEnum;
  }
  
  get testStepResultEnum(): typeof TestStepResultEnum {
    return TestStepResultEnum;
  }

}