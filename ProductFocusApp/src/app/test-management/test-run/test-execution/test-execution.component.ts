import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ITestRunCase, ITestRunStep, MarkTestCaseStatusEvent, MarkTestStepStatusEvent, TestCaseResultEnum, TestResultCounter, TestStepResultEnum } from '../../models';

@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.scss']
})
export class TestExecutionComponent implements OnChanges {
  @Input('testCases') testCases: ITestRunCase[] = [];
  @Output('testResultCounter') testResultCountEmitter = new EventEmitter<TestResultCounter>();
  @Output('testCaseChanged') testCaseStatusChanged = new EventEmitter<MarkTestCaseStatusEvent>();
  @Output('testStepChanged') testStepStatusChanged = new EventEmitter<MarkTestStepStatusEvent>();

  currentExecutingNumber = 0;

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.currentExecutingNumber = 0;
  }

  moveToPreviousTestCase() {
    this.currentExecutingNumber+=this.testCases.length - 1;
    this.currentExecutingNumber %= this.testCases.length;
  }
  
  moveToNextTestCase() {
    this.currentExecutingNumber++;
    this.currentExecutingNumber %= this.testCases.length;
  }

  markTestCaseStatus(status: TestCaseResultEnum, testCase: ITestRunCase): void {
    testCase.resultStatus = status;
    this.testCaseStatusChanged.emit({status: status, item: testCase});
    this.emitCounter();
    
  }

  markTestStepStatus(status: TestStepResultEnum, testStep: ITestRunStep): void {
    testStep.resultStatus = status;
    this.testStepStatusChanged.emit({status: status, item: testStep});
  }

  emitCounter() {
    let success = 0, failure = 0, blocked = 0;
    this.testCases.forEach(testcase => {
        success += testcase.resultStatus === TestCaseResultEnum.Success ? 1 : 0;
        failure += testcase.resultStatus === TestCaseResultEnum.Failed ? 1 : 0;
        blocked += testcase.resultStatus === TestCaseResultEnum.Blocked ? 1 : 0;
    });
    this.testResultCountEmitter.emit({success: success, failure: failure, blocked: blocked, total: this.testCases.length});
  }

  get testCaseResultEnum(): typeof TestCaseResultEnum {
    return TestCaseResultEnum;
  }
  
  get testStepResultEnum(): typeof TestStepResultEnum {
    return TestStepResultEnum;
  }

}