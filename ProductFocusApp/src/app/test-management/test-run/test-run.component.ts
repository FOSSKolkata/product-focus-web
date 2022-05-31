import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { IMarkTestCasesVersion, ITestRun, ITestRunCase, ITestRunSuite } from '../models.ts';
import { TestRunService } from '../_services/test-run.service';
@Component({
  selector: 'app-test-run',
  templateUrl: './test-run.component.html',
  styleUrls: ['./test-run.component.scss']
})
export class TestRunComponent implements OnInit {

  testPlanVersionId: number;
  $testRun!: Observable<ITestRun>;
  testRun!: ITestRun;
  firstTestCaseSelected = false;
  constructor(private route: ActivatedRoute,
    private testRunService: TestRunService,
    private tostr: ToastrService) { 
    this.testPlanVersionId = Number(this.route.snapshot.paramMap.get('testPlanVersionId'));
  }

  ngOnInit(): void {
    this.$testRun = this.testRunService.getTestRunById(this.testPlanVersionId);
    this.$testRun.subscribe(x => {
      this.testRun = x;
      this.markSuiteIfAllTestCaseSelected();
      if(this.isAtleastOneTestCaseSelected()) {
        this.firstTestCaseSelected = true;
      }
    });
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
    if(!this.isAtleastOneTestCaseSelected() && isSelected) {
      this.firstTestCaseSelected = true;
    }

    let updatedTestCases: IMarkTestCasesVersion[] = [];
    suite.testCases.forEach(testcase => {
      testcase.isIncluded = suite.isIncluded;
      updatedTestCases.push({id: testcase.id, isSelected: testcase.isIncluded});
    });
    
    if(!this.isAtleastOneTestCaseSelected()) {
      this.firstTestCaseSelected = false;
    }

    this.updateTestCases(updatedTestCases);
  }

  changeCaseChoice(suite: ITestRunSuite, testCase: ITestRunCase, isSelected: boolean): void {
    if(!this.isAtleastOneTestCaseSelected() && isSelected) {
      this.firstTestCaseSelected = true;
    }

    let updatedTestCases: IMarkTestCasesVersion[] = [{id: testCase.id, isSelected: testCase.isIncluded}];
    let isAllSelected = true;
    suite.testCases.forEach(testcase => {
      isAllSelected &&= testcase.isIncluded;
    });
    suite.isIncluded = isAllSelected;

    if(!this.isAtleastOneTestCaseSelected()) {
      this.firstTestCaseSelected = false;
    }

    this.updateTestCases(updatedTestCases);
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

  updateTestCases(updatedTestCases: IMarkTestCasesVersion[]) {
    this.testRunService.markTestCasesVersion(updatedTestCases).subscribe(x => {

    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }
}
