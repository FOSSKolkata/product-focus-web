import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ITestRun, ITestRunSuite } from '../models.ts';
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
  constructor(private route: ActivatedRoute,
    private testRunService: TestRunService) { 
    this.testPlanVersionId = Number(this.route.snapshot.paramMap.get('testPlanVersionId'));
  }

  ngOnInit(): void {
    this.$testRun = this.testRunService.getTestRunById(this.testPlanVersionId);
    this.$testRun.subscribe(x => {
      console.log(x);
      this.testRun = x;

    });
  }
  
  changeSuiteChoice(suite: ITestRunSuite): void {
    suite.testCases.map(testCase => {
      testCase.isIncluded = suite.isIncluded;
    });
  }

  changeCaseChoice(suite: ITestRunSuite): void {
    let isAllSelected = true;
    suite.testCases.forEach(testcase => {
      isAllSelected &&= testcase.isIncluded;
    });
    suite.isIncluded = isAllSelected;
  }
}
