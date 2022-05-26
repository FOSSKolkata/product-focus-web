import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ITestRun } from '../models.ts';
import { TestRunService } from '../_services/test-run.service';
import { TestExecutionService } from '../services/test-execution.service';
@Component({
  selector: 'app-test-run',
  templateUrl: './test-run.component.html',
  styleUrls: ['./test-run.component.scss']
})
export class TestRunComponent implements OnInit {
  suitesMock: any[] = [{
    id: 1,
    title: '$Test suite title 1',
    completed: false,
    testcases: [
      {title: '$Test case title 1', completed: false},
      {title: '$Test case title 2', completed: false},
      {title: '$Test case title 3', completed: false},
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
  updateAllComplete() {
    this.testExecutionService.updateTestRun(this.testRun);
    // this.allComplete = this.suitesMock.testcases != null && this.task.subtasks.every(t => t.completed);
  }

  testPlanVersionId: number;
  $testRun!: Observable<ITestRun>;
  testRun!: ITestRun;
  constructor(private route: ActivatedRoute,
    private testRunService: TestRunService,
    private testExecutionService: TestExecutionService) { 
    this.testPlanVersionId = Number(this.route.snapshot.paramMap.get('testPlanVersionId'));
  }

  ngOnInit(): void {
    this.$testRun = this.testRunService.getTestRunById(this.testPlanVersionId);
    this.$testRun.subscribe(x => {
      console.log(x);
      this.testRun = x;
    });
  }

  // get isTestSuiteIncluded(suite: ITestRunStep): boolean {
  //   return true;
  // }

}
