import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TestResultItem, TestResultRunningStatusEnum, TestTypeEnum } from '../models';
import { TestResultService } from '../_services/test-result.service';

@Component({
  selector: 'app-test-run-results',
  templateUrl: './test-run-results.component.html',
  styleUrls: ['./test-run-results.component.scss']
})
export class TestRunResultsComponent implements OnInit {
  searchTestTypeMock = null;
  testTypes = Object.keys(TestTypeEnum)
    .filter(v => isNaN(Number(v)))
    .map(name => {
      return {
        id: name,
        name: name.split(/(?=[A-Z])/).join(' ')
      }
    });
  testersMock = ['Vikram shaw', 'Amit shah', 'Sandeep singh'];
  selectedTesters = null;

  planId: number;
  testResults: TestResultItem[] = [];
  searchKeyword: string = '';
  updateSearchKeyword = new Subject<string>();
  searchTestTypes: TestTypeEnum[] = [];
  totalTestCaseCount = 0;
  totalPassedTestCases = 0;
  totalFailedTestCases = 0;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private testResultService: TestResultService) {
      this.planId = this.route.snapshot.params['testPlanId'];
      this.route.queryParamMap.subscribe(x => {
        this.searchKeyword = x.get('searchKeyword')??'';
        this.setTestResults();
      });
      
      this.updateSearchKeyword.pipe(
        debounceTime(1000),
        distinctUntilChanged())
        .subscribe(x => {
          this.updateURL();
        })
    }

  ngOnInit(): void {

  }

  updateURL() {
    this.router.navigate([],{relativeTo: this.route,
      queryParams: {searchKeyword: this.searchKeyword, type: this.searchTestTypes }
    });
  }

  testTypeChange(event: MatSelectChange) {
    this.searchTestTypes = [];
    (event.value as TestTypeEnum[]).forEach(x => {
      this.searchTestTypes.push(x);
    });
    this.updateURL();
  }

  setTestResults(): void {
    this.testResultService.getTestResultsByTestPlanId(this.planId, this.searchKeyword, this.searchTestTypes).subscribe(x => {
      this.testResults = x;
      this.totalTestCaseCount = 0;
      x.forEach(item => {
        this.totalTestCaseCount += item.testCasesCount;
        this.totalPassedTestCases += item.passed;
        this.totalFailedTestCases += item.failed;
      });
    });
  }

  get testResultRunningStatusEnum(): typeof TestResultRunningStatusEnum {
    return TestResultRunningStatusEnum;
  }

  get testTypeEnum(): typeof TestTypeEnum {
    return TestTypeEnum;
  }
  
}
