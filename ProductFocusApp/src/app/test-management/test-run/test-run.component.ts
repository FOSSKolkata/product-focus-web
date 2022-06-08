import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { IMarkTestCasesVersion, IMarkTestCaseVersionStatus, IMarkTestStepVersionStatus, ITestRun, ITestRunCase, ITestRunSuite, MarkTestCaseStatusEvent, MarkTestStepStatusEvent, TestCaseResultEnum, TestResultCounter } from '../models';
import { TestRunService } from '../_services/test-run.service';
@Component({
  selector: 'app-test-run',
  templateUrl: './test-run.component.html',
  styleUrls: ['./test-run.component.scss']
})
export class TestRunComponent implements OnInit {
  testResultCounter: TestResultCounter = {success: 1, failure: 1, blocked: 1, total: 1};
  testPlanVersionId: number;
  $testRun!: Observable<ITestRun>;
  includedTestCases : ITestRunCase[] = [];
  testRun!: ITestRun;
  constructor(private route: ActivatedRoute,
    private testRunService: TestRunService,
    private tostr: ToastrService) { 
    this.testPlanVersionId = Number(this.route.snapshot.paramMap.get('testPlanVersionId'));
  }

  ngOnInit(): void {
    this.$testRun = this.testRunService.getTestRunById(this.testPlanVersionId);
    this.$testRun.subscribe(x => {
      this.testRun = x;
      this.updateCounter();
      this.markSuiteIfAllTestCaseSelected();
    });
  }

  updateCounter() {
    let counter: TestResultCounter = new TestResultCounter();
    let filteredTestCases: ITestRunCase[] = [];
    this.testRun.testSuites.forEach(testsuite => {
      testsuite.testCases.forEach(testcase => {
        if(testcase.isIncluded) {
          filteredTestCases.push(testcase);
          counter.success += testcase.resultStatus === TestCaseResultEnum.Success ? 1 : 0;
          counter.failure += testcase.resultStatus === TestCaseResultEnum.Failed ? 1 : 0;
          counter.blocked += testcase.resultStatus === TestCaseResultEnum.Blocked ? 1 : 0;
          counter.total ++;
        }
      });
    });
    this.includedTestCases = filteredTestCases;
    this.changeCounter(counter);
  }

  changeCounter(testResultCounter: TestResultCounter) {
    this.testResultCounter = testResultCounter;
  }

  markSuiteIfAllTestCaseSelected(): void {
    this.testRun.testSuites.forEach(testSuite => {
      let isAllSelected = true;
      testSuite.testCases.forEach(testCase => {
        isAllSelected &&= testCase.isIncluded;
      });
      testSuite.isIncluded = isAllSelected;
    });
  }
  
  changeSuiteChoice(suite: ITestRunSuite, isSelected: boolean): void {

    let updatedTestCases: IMarkTestCasesVersion[] = [];
    suite.testCases.forEach(testcase => {
      testcase.isIncluded = suite.isIncluded;
      updatedTestCases.push({id: testcase.id, isSelected: testcase.isIncluded});
    });

    this.updateTestCases(updatedTestCases);
    this.updateCounter();
  }

  changeCaseChoice(suite: ITestRunSuite, testCase: ITestRunCase, isSelected: boolean): void {

    let updatedTestCases: IMarkTestCasesVersion[] = [{id: testCase.id, isSelected: testCase.isIncluded}];
    let isAllSelected = true;
    suite.testCases.forEach(testcase => {
      isAllSelected &&= testcase.isIncluded;
    });
    suite.isIncluded = isAllSelected;

    this.updateTestCases(updatedTestCases);
    this.updateCounter();
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

  testCaseChanged(event: MarkTestCaseStatusEvent) {
    let updatedTestCase: IMarkTestCaseVersionStatus = {id: event.item.id, resultStatus: event.status};
    this.testRunService.markTestCaseStatusVersion(this.testRun.id, updatedTestCase).subscribe(x => {

    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }

  testStepChanged(event: MarkTestStepStatusEvent) {
    let updatedTestStep: IMarkTestStepVersionStatus = {id: event.item.id, resultStatus: event.status};
    this.testRunService.markTestStepStatusVersion(this.testRun.id, updatedTestStep).subscribe(x => {

    }, err => {
      this.tostr.error(err.error, 'Failed');
    })
  }

  updateTestCases(updatedTestCases: IMarkTestCasesVersion[]) {
    this.testRunService.markTestCasesVersion(this.testRun.id, updatedTestCases).subscribe(x => {

    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }
}
