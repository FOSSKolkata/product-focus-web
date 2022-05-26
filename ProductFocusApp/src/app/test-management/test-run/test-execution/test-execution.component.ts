import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ITestRun } from '../../models.ts';
import { TestExecutionService } from '../../services/test-execution.service';

@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.scss']
})
export class TestExecutionComponent {

  testRun!: ITestRun;
  constructor(private testExecutionService: TestExecutionService) {
    this.testExecutionService.testRunObserver.subscribe(x => {
      this.testRun = x;
      console.log(this.testRun);
    });
  }

}
